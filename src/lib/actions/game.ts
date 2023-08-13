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

    // Update competitors' stats
    if (disciplineId === Discipline.UFC) {
      if (winnerId) {
        // Update winner stats
        const incrementWinStat =
          ufcResultsDbColumns[resultData.endMethod as UfcEndMethods]
        const loserId = competitorIds.filter((id) => id !== winnerId)[0]
        await prisma.ufcCompetitorStats.upsert({
          where: {
            competitorId: winnerId,
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
            competitorId: winnerId,
            wins: 1,
            games: 1,
            [incrementWinStat]: 1,
          },
        })

        // Update loser stats
        await prisma.ufcCompetitorStats.upsert({
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
        await prisma.ufcCompetitorStats.upsert({
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

        await prisma.ufcCompetitorStats.upsert({
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
