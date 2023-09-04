'use server'
import { UfcLiveStatistics } from '@/lib/ufc/live-results'
import { prisma } from '@/db'

export const updateLiveStatistics = async (data: UfcLiveStatistics, gameId: number): Promise<UfcLiveStatistics> => {
  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: gameId
      },
      data: {
        liveStatistics: data
      }
    })

    return updatedGame.liveStatistics as UfcLiveStatistics
  } catch (e: any) {
    throw e
  }

}