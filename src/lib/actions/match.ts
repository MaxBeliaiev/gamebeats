'use server'
import { GameStatus, Match, MatchStatus } from '@prisma/client'
import { prisma } from '@/db'
import { PrismaClientCommon } from '@/lib/types'
import { NextResponse } from 'next/server'

export const finishMatch = async (
  match: Match,
  winnerId: number | null,
  client: PrismaClientCommon = prisma
) => {
  try {
    await client.match.update({
      data: {
        status: MatchStatus.FINISHED,
        endedAt: new Date(),
        winnerId,
      },
      where: {
        id: match.id,
      },
    })
  } catch (e: any) {
    throw e
  }
}

export const cancelMatch = async (
  id: number
) => {
 return prisma.$transaction(async (tx) => {
    try {
      await tx.match.update({
        data: {
          status: MatchStatus.CANCELED,
        },
        where: {
          id,
        },
      })

      await tx.game.updateMany({
        where: {
          matchId: id,
        },
        data: {
          status: GameStatus.CANCELED
        }
      })
    } catch (e: any) {
      throw e
    }
  })
}