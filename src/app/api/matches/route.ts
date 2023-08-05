import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchCreateReqSchema } from '@/lib/schemas/match'

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const {
      competitorOne,
      competitorTwo,
      tournamentId,
      startedAt,
    } = matchCreateReqSchema.parse(body)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    let data = {
      tournamentId,
      startedAt,
      competitorsIds: [competitorOne, competitorTwo],
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
