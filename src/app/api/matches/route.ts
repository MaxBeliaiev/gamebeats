import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchCreateReqSchema } from '@/lib/schemas/match'
import { MatchStatus } from '@prisma/client'

export async function GET(req: Request) {
  try {
    // let fullFields = Boolean(getAuthSession())
    const { searchParams } = new URL(req.url)

    const take = Number(searchParams.get('size')) || 10
    const page = Number(searchParams.get('page')) || 0
    const statuses = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || ''
    const sort = searchParams.get('sort') || ''
    const orderBy: {[x: string]: string} = (sort && sortBy) ? { [sortBy]: sort } : { startedAt: 'asc' }

    const data = await prisma.match.findMany({
      take,
      skip: page ? (page - 1) * take : 0,
      orderBy,
      where: {
        ...(statuses && {
          status: {
            in: statuses?.split(',').map(s => s.toUpperCase()) as Array<MatchStatus>,
          },
        }),
      },
      select: {
        id: true,
        startedAt: true,
        endedAt: true,
        status: true,
        streamChannel: true,
        competitors: {
          orderBy: {
            order: 'asc',
          },
          select: {
            order: true,
            score: true,
            competitor: {
              select: {
                nickname: true,
              },
            },
          },
        },
        tournament: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ data, cached: new Date() })
  } catch (error) {
    console.log('[MATCHES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const {
      competitorOne,
      competitorTwo,
      tournamentId,
      startedAt,
      streamChannel,
    } = matchCreateReqSchema.parse(body)

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

    return await prisma.$transaction(
      async (tx) => {
        const match = await tx.match.create({
          data,
        })

        await tx.game.create({
          data: {
            matchId: match.id,
          },
        })

        return NextResponse.json(match)
      },
      { timeout: 5000 }
    )
  } catch (error) {
    console.log('[MATCHES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
