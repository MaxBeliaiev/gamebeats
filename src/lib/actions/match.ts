'use server'
import { Match, MatchStatus } from '@prisma/client'
import { prisma } from '@/db'
import { PrismaClientCommon } from '@/lib/types'

export const finishMatch = async (
  match: Match,
  client: PrismaClientCommon = prisma
) => {
  try {
    await client.match.update({
      data: {
        status: MatchStatus.FINISHED,
        endedAt: new Date(),
      },
      where: {
        id: match.id,
      },
    })
  } catch (e: any) {
    throw e
  }
}
