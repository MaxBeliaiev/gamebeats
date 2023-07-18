import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchCreateReqSchema } from '@/lib/schemas/match'
import { MatchStatus } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const {
      competitorOne,
      competitorTwo,
      tournamentId,
      startedAt,
      endedAt,
      status,
    } = matchCreateReqSchema.parse(body)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const endedAtCalculated =
      status && status !== MatchStatus.FINISHED ? null : endedAt

    let data = {
      status: status as MatchStatus,
      ...(endedAtCalculated && { status: MatchStatus.FINISHED }),
      tournamentId,
      startedAt,
      endedAt: endedAtCalculated,
      competitors: {
        create: [
          {
            competitor: {
              connect: {
                id: Number(competitorOne),
              },
            },
          },
          {
            competitor: {
              connect: {
                id: Number(competitorTwo),
              },
            },
          },
        ],
      },
    }

    const match = await prisma.match.create({
      data,
    })

    return NextResponse.json(match)
  } catch (error) {
    console.log('[MATCHES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
