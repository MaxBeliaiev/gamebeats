'use server'
import {
  Discipline,
  Game,
  GameStatus,
  MatchStatus,
  Prisma,
  UfcEndMethods,
} from '@prisma/client'
import { prisma } from '@/db'
import { needsToFinish } from '@/lib/helpers/match'
import { finishMatch } from '@/lib/actions/match'
import * as z from 'zod'
import { ufcResultsDbColumns } from '@/lib/constants/results'
import { getStartPeriod } from '@/lib/helpers/ufcStats'
import JsonNull = Prisma.JsonNull
import { gameFormSchema } from '@/lib/schemas/game'
import { PrismaClientCommon } from '@/lib/types'

export const finishUfcGame = async (props: {
  game: Game
  winnerId: number | null
  resultData: {
    round: number
    endTime: string
    endMethod: UfcEndMethods
  }
}) => {
  const { game, winnerId, resultData } = z
    .object({
      game: z.any({
        required_error: 'Game is required',
      }),
      resultData: z.any({
        required_error: 'Game is required',
      }),
      winnerId: z.number().nullable(),
    })
    .parse(props)


  return prisma.$transaction(async (tx) => {
    const updatedGame = await tx.game.update({
      where: {
        id: game.id,
      },
      data: {
        winnerId,
        status: GameStatus.FINISHED,
        endedAt: new Date(),
        ufcResultDetails: {
          create: winnerId ? resultData : {
            round: 3,
            isDraw: true,
            endMethod: UfcEndMethods.DEC,
            endTime: '3:00',
          },
        },
      },
      include: {
        match: {
          include: {
            games: true,
            tournament: {
              select: {
                id: true,
                disciplineId: true,
              },
            },
            competitors: {
              include: {
                competitor: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const { match } = updatedGame
    const {
      tournament: { disciplineId, id: tournamentId },
      id: matchId,
      competitors,
    } = match

    const competitorIds = competitors.map((c) => c.competitor.id)

    // Update score
    if (winnerId) {
      await tx.matchesOnCompetitors.updateMany({
        where: {
          competitorId: winnerId,
          matchId,
        },
        data: {
          score: {
            increment: 1,
          },
        },
      })
    }

    if (needsToFinish(match)) {
      const currentScore = await tx.matchesOnCompetitors.findMany({
        where: {
          matchId
        }
      })

      let matchWinner = null;

      if (currentScore[0].score !== currentScore[1].score) {
        matchWinner = currentScore[0].score > currentScore[1].score ? currentScore[0].competitorId : currentScore[1].competitorId;
      }

      await finishMatch(match, matchWinner, tx)
    }

    // Update competitors' stats
    const startOfCurrentPeriod = getStartPeriod()
    if (disciplineId === Discipline.UFC) {
      if (winnerId) {
        // Update winner stats
        const incrementWinStat =
          ufcResultsDbColumns[resultData.endMethod as UfcEndMethods]
        const loserId = competitorIds.filter((id) => id !== winnerId)[0]
        const winnerStats = await tx.ufcCompetitorStats.findFirst({
          where: {
            competitorId: winnerId,
            periodStartedAt: startOfCurrentPeriod,
            tournamentId,
          }
        })

        if (winnerStats) {
          await tx.ufcCompetitorStats.update({
            where: {
              id: winnerStats.id
            },
            data: {
              [incrementWinStat]: {
                increment: 1,
              },
              wins: {
                increment: 1,
              },
              games: {
                increment: 1,
              },
            }
          })
        } else {
          await tx.ufcCompetitorStats.create({
            data: {
              periodStartedAt: startOfCurrentPeriod,
              competitorId: winnerId,
              tournamentId,
              wins: 1,
              games: 1,
              [incrementWinStat]: 1,
            }
          })
        }

        // Update loser stats
        const loserStats = await tx.ufcCompetitorStats.findFirst({
          where: {
            competitorId: loserId,
            periodStartedAt: startOfCurrentPeriod,
            tournamentId,
          }
        })

        if (loserStats) {
          await tx.ufcCompetitorStats.update({
            where: {
              id: loserStats.id
            },
            data: {
              losses: {
                increment: 1,
              },
              games: {
                increment: 1,
              },
            }
          })
        } else {
          await tx.ufcCompetitorStats.create({
            data: {
              periodStartedAt: startOfCurrentPeriod,
              competitorId: loserId,
              tournamentId,
              losses: 1,
              games: 1,
            }
          })
        }
      } else {
        // Add draw to both players
        for (const id of competitorIds) {
          const stats = await tx.ufcCompetitorStats.findFirst({
            where: {
              competitorId: id,
              periodStartedAt: startOfCurrentPeriod,
              tournamentId,
            }
          })

          if (stats) {
            await tx.ufcCompetitorStats.update({
              where: {
                id: stats.id,
              },
              data: {
                draws: {
                  increment: 1,
                },
                games: {
                  increment: 1,
                },
              }
            })
          } else {
            await tx.ufcCompetitorStats.create({
              data: {
                periodStartedAt: startOfCurrentPeriod,
                competitorId: id,
                tournamentId,
                draws: 1,
                games: 1,
              }
            })
          }
        }
      }
    }
  }, { timeout: 7000 })
}

export const updateGameStatus = async (
  gameId: number,
  status: MatchStatus,
  startedAt: Date | null = null,
  client: PrismaClientCommon = prisma
) => {
  try {
    await client.game.update({
      where: {
        id: gameId,
      },
      data: {
        status,
        ...((status === MatchStatus.ONGOING && startedAt) && {
          startedAt: startedAt,
        }),
      },
    })
  } catch (e: any) {
    throw e
  }
}

export const refreshGame = async (
  gameId: number,
  client: PrismaClientCommon = prisma
) => {
  try {
    await client.game.update({
      where: {
        id: gameId,
      },
      data: {
        status: GameStatus.ONGOING,
        liveStatistics: JsonNull,
      },
    })
  } catch (e: any) {
    throw e
  }
}

export const updateUfcGame = async (
  gameId: number,
  data: any,
  client: PrismaClientCommon = prisma
) => {
  try {
    const { startedAt } =
      gameFormSchema.parse(data)

    await client.game.update({
      where: {
        id: gameId,
      },
      data: {
        startedAt,
      },
    })
  } catch (e: any) {
    throw e
  }
}

export const cancelGame = async (
  gameId: number,
  matchId: number,
  client: PrismaClientCommon = prisma
) => {
  return prisma.$transaction(async (tx = client) => {
    try {
      await tx.game.update({
        where: {
          id: gameId,
        },
        data: {
          status: GameStatus.CANCELED,
          liveStatistics: JsonNull,
        },
      })

      const match = await tx.match.findUnique({
        where: {
          id: matchId,
        },
        include: {
          games: true,
        }
      })

      if (match && needsToFinish(match)) {
        const currentScore = await tx.matchesOnCompetitors.findMany({
          where: {
            matchId
          }
        })

        let matchWinner = null;
        if (currentScore[0].score !== currentScore[1].score) {
          matchWinner = currentScore[0].score > currentScore[1].score ? currentScore[0].competitorId : currentScore[1].competitorId;
        }

        await finishMatch(match, matchWinner, tx)
      }
    } catch (e: any) {
      throw e
    }
  }, { timeout: 5000 })
}