import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchCreateReqSchema } from '@/lib/schemas/match'
import { MatchStatus } from '@prisma/client'
import { corsHeaders } from '@/lib/constants/requests'
import { addMinutes } from 'date-fns'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const take = Number(searchParams.get('size')) || 10
    const page = Number(searchParams.get('page')) || 0
    const statuses = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || ''
    const sort = searchParams.get('sort') || ''
    const tournamentId = searchParams.get('tournamentId') || ''
    const results = searchParams.get('results') || ''
    const external = searchParams.get('external') || ''
    const startedFrom = searchParams.get('startedFrom') || ''
    const startedTo = searchParams.get('startedTo') || ''
    const isAdmin = !external && Boolean(getAuthSession())
    const orderBy: any = (sort && sortBy) ? [{ [sortBy]: sort }] : [{ startedAt: 'asc' }]
    const adminOrderBy = [
      {
        status: 'asc',
      },
      {
        startedAt: 'asc',
      },
      {
        streamChannel: 'asc',
      }
    ]

    const startedAtQuery = startedFrom ?
        startedTo ? { startedAt: { gte: startedFrom, lte: startedTo } } : { startedAt: startedFrom }
        : {}

    const query = {
      ...(tournamentId && {
        tournamentId: Number(tournamentId),
      }),
      ...(statuses && {
        status: statuses.toUpperCase() as MatchStatus,
        //   {
        //   in: statuses?.split(',').map(s => s.toUpperCase()) as Array<MatchStatus>,
        // },
      }),
      ...startedAtQuery,
    }

    const data = await prisma.match.findMany({
      take,
      skip: page ? (page - 1) * take : 0,
      orderBy: isAdmin ? adminOrderBy: orderBy,
      where: query,
      select: {
        id: true,
        startedAt: true,
        endedAt: true,
        status: true,
        streamChannel: true,
        format: true,
        numberOfGames: true,
        winner: true,
        competitors: {
          orderBy: {
            order: 'asc',
          },
          select: {
            order: true,
            score: true,
            competitorId: true,
            competitor: {
              select: {
                id: true,
                nickname: true,
                name: true,
                surname: true,
                image: true,
                imageSmall: true,
                imageTransparent: true,
              },
            },
          },
        },
        tournament: {
          select: {
            name: true,
          },
        },
        ...(results && {
          games: {
            select: {
              id: true,
              startedAt: true,
              endedAt: true,
              matchId: true,
              status: true,
              winner: {
                select: {
                  id: true,
                  nickname: true,
                  image: true,
                  imageSmall: true,
                  imageTransparent: true,
                }
              },
              ufcResultDetails: true
            }
          }
        })
      },
    })

    const response= {
      data,
      cached: new Date(),
      isAdmin,
      ...( isAdmin && {
        pagination: {
          total: await prisma.match.count({
            where: query,
          })
        }
      })
    }

    return NextResponse.json(response, { headers: corsHeaders })
  } catch (error) {
    console.log('[MATCHES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
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
      numberOfGames,
    } = matchCreateReqSchema.parse(body)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    let data = {
      tournamentId,
      startedAt,
      streamChannel,
      numberOfGames,
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
        const matchExists = await tx.match.findFirst({
          where: {
            startedAt,
            AND: [
              {
                competitors: {
                  some: {
                    competitor: {
                      id: Number(competitorOne),
                    }
                  }
                }},
              {
                competitors: {
                  some: {
                    competitor: {
                      id: Number(competitorTwo),
                    }
                  }
                }}
            ],
          }
        })

        if (matchExists) {
          return new NextResponse('Same match already exists', { status: 400 })
        }

        const match = await tx.match.create({
          data,
        })

        const gamesToCreate = []
        let gameStartTime = match.startedAt
        for (let i = 0; i < match.numberOfGames; i++) {
          gamesToCreate.push({ matchId: match.id, startedAt: gameStartTime })
          gameStartTime = addMinutes(gameStartTime, 12)
        }

        await tx.game.createMany({
          data: gamesToCreate,
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
