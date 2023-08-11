'use server'
import {
  Discipline,
  Game,
  GameStatus,
  MatchStatus,
  UfcWinMethods,
} from '@prisma/client'
import { prisma } from '@/db'
import { needsToFinish } from '@/lib/helpers/match'
import { finishMatch } from '@/lib/actions/match'
import * as z from 'zod'
import { ufcResultIncrementColumns } from '@/lib/constants/results'

export const finishUfcGame = async (props: {
  game: Game
  winnerId: number | null
  resultData: {
    round: number
    winTime: string
    winMethod: UfcWinMethods
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
        ...(winnerId && {
          ufcResultDetails: {
            create: resultData,
          },
        }),
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

    needsToFinish(match) && (await finishMatch(match, tx))

    const competitorIds = competitors.map((c) => c.competitor.id)

    // Update score
    if (winnerId) {
      await prisma.matchesOnCompetitors.updateMany({
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

    // Update stats
    if (disciplineId === Discipline.UFC) {
      if (winnerId) {
        // Update winner stats
        const incrementStat =
          ufcResultIncrementColumns[resultData.winMethod as UfcWinMethods]
        const loserId = competitorIds.filter((id) => id !== winnerId)[0]
        await prisma.ufcStatistics.upsert({
          where: {
            competitorId: winnerId,
          },
          update: {
            [incrementStat]: {
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
            competitorId: winnerId,
            wins: 1,
            games: 1,
            [incrementStat]: 1,
          },
        })

        // Update loser stats
        await prisma.ufcStatistics.upsert({
          where: {
            competitorId: loserId,
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
            competitorId: loserId,
            losses: 1,
            games: 1,
          },
        })
      } else {
        // Add draw to both players
        await prisma.ufcStatistics.upsert({
          where: {
            competitorId: competitorIds[0],
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
            competitorId: competitorIds[0],
            draws: 1,
            games: 1,
          },
        })

        await prisma.ufcStatistics.upsert({
          where: {
            competitorId: competitorIds[1],
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
  startedAt: Date | null = null
) => {
  try {
    await prisma.game.update({
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
