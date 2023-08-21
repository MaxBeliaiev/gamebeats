'use server'
import {
  Discipline,
  Game,
  GameStatus,
  MatchStatus,
  UfcEndMethods,
} from '@prisma/client'
import { prisma } from '@/db'
import { needsToFinish } from '@/lib/helpers/match'
import { finishMatch } from '@/lib/actions/match'
import * as z from 'zod'
import { ufcResultsDbColumns } from '@/lib/constants/results'
import moment from "moment/moment";
import {getUtcStartOfMonth} from "@/lib/helpers/date";

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
      tournament: { disciplineId },
      id: matchId,
      competitors,
    } = match

    needsToFinish(match) && (await finishMatch(match, winnerId, tx))

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

    const startOfCurrentMonth = getUtcStartOfMonth()
    // Update competitors' stats
    if (disciplineId === Discipline.UFC) {
      if (winnerId) {
        // Update winner stats
        const incrementWinStat =
          ufcResultsDbColumns[resultData.endMethod as UfcEndMethods]
        const loserId = competitorIds.filter((id) => id !== winnerId)[0]
        await tx.ufcCompetitorStats.upsert({
          where: {
            competitorId_periodStartedAt: {
              competitorId: winnerId,
              periodStartedAt: startOfCurrentMonth,
            }
          },
          update: {
            [incrementWinStat]: {
              increment: 1,
            },
            wins: {
              increment: 1,
            },
            games: {
              increment: 1,
            },
          },
          create: {
            periodStartedAt: startOfCurrentMonth,
            competitorId: winnerId,
            wins: 1,
            games: 1,
            [incrementWinStat]: 1,
          },
        })

        // Update loser stats
        await tx.ufcCompetitorStats.upsert({
          where: {
            competitorId_periodStartedAt: {
              competitorId: loserId,
              periodStartedAt: startOfCurrentMonth,
            },
          },
          update: {
            losses: {
              increment: 1,
            },
            games: {
              increment: 1,
            },
          },
          create: {
            periodStartedAt: startOfCurrentMonth,
            competitorId: loserId,
            losses: 1,
            games: 1,
          },
        })
      } else {
        // Add draw to both players
        await tx.ufcCompetitorStats.upsert({
          where: {
            competitorId_periodStartedAt: {
              competitorId: competitorIds[0],
              periodStartedAt: startOfCurrentMonth,
            },
          },
          update: {
            draws: {
              increment: 1,
            },
            games: {
              increment: 1,
            },
          },
          create: {
            periodStartedAt: startOfCurrentMonth,
            competitorId: competitorIds[0],
            draws: 1,
            games: 1,
          },
        })

        await tx.ufcCompetitorStats.upsert({
          where: {
            competitorId_periodStartedAt: {
              competitorId: competitorIds[1],
              periodStartedAt: startOfCurrentMonth,
            },
          },
          update: {
            draws: {
              increment: 1,
            },
            games: {
              increment: 1,
            },
          },
          create: {
            periodStartedAt: startOfCurrentMonth,
            competitorId: competitorIds[1],
            draws: 1,
            games: 1,
          },
        })
      }
    }
  })
}

export const updateGameStatus = async (
  gameId: number,
  status: MatchStatus,
  startedAt: Date | null = null,
  client = prisma
) => {
  try {
    await client.game.update({
      where: {
        id: gameId,
      },
      data: {
        status,
        ...(status === MatchStatus.ONGOING && {
          startedAt: startedAt || new Date(),
        }),
      },
    })
  } catch (e: any) {
    throw e
  }
}
