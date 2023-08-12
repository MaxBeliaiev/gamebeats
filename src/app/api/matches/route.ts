import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchCreateReqSchema } from '@/lib/schemas/match'
import { MatchStatus } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const { competitorOne, competitorTwo, tournamentId, startedAt, streamChannel } =
      matchCreateReqSchema.parse(body)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    let data = {
      tournamentId,
      startedAt,
      streamChannel,
      competitors: {
        create: [
          {
            competitor: {
              connect: {
                id: Number(competitorOne),
              },
            },
            order: 1,
          },
          {
            competitor: {
              connect: {
                id: Number(competitorTwo),
              },
            },
            order: 2,
          },
        ],
      },
    }

    const match = await prisma.match.create({
      data,
    })

    await prisma.game.create({
      data: {
        matchId: match.id,
      },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.log('[MATCHES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
