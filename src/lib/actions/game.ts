'use server'
import { Game, GameStatus, Match, MatchStatus } from '@prisma/client'
import { prisma } from '@/db'
import { needsToFinish } from '@/lib/helpers/match'
import { finishMatch } from '@/lib/actions/match'
import { tournamentUpdateReqSchema } from '@/lib/schemas/tournament'
import * as z from 'zod'

export const finishGame = async (props: {
  game: Game
  data: {
    winnerId: number | null
  }
}) => {
  const { game, data } = z
    .object({
      game: z.any({
        required_error: 'Game is required',
      }),
      data: z.any({
        required_error: 'Game is required',
      }),
    })
    .parse(props)

  return prisma.$transaction(async (tx) => {
    const { winnerId } = data
    const updatedGame = await tx.game.update({
      where: {
        id: game.id,
      },
      data: {
        winnerId,
        status: GameStatus.FINISHED,
        endedAt: new Date(),
      },
      include: {
        match: {
          include: {
            games: true,
          },
        },
      },
    })

    const { match } = updatedGame

    needsToFinish(match) && (await finishMatch(match, tx))
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
