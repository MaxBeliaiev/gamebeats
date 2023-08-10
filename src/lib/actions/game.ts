'use server'
import { Game, GameStatus, MatchStatus } from '@prisma/client'
import { prisma } from '@/db'

export const finishGame = async ({
  game,
  data,
}: {
  game: Game
  data: {
    winnerId: number | null
  }
}) => {
  try {
    const { winnerId } = data
    await prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        winnerId,
        status: GameStatus.FINISHED,
        endedAt: new Date(),
      },
    })
  } catch (e: any) {
    throw e
  }
}

export const updateGameStatus = async (gameId: number, status: MatchStatus) => {
  try {
    await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        status,
        ...(status === MatchStatus.ONGOING && { startedAt: new Date() }),
      },
    })
  } catch (e: any) {
    throw e
  }
}
