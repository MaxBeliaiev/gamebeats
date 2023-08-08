'use server'
import { MatchStatus } from '@prisma/client'
import { prisma } from '@/db'

export const updateMatchStatus = async (id: number, status: MatchStatus) => {
  try {
    await prisma.game.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })
  } catch (e: any) {
    throw e
  }
}