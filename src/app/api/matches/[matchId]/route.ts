import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchPatchReqSchema, matchUpdateReqSchema } from '@/lib/schemas/match'
import { GameStatus, MatchStatus } from '@prisma/client'
import { updateGameStatus } from '@/lib/actions/game'
import { addMinutes } from 'date-fns'

export async function PUT(
  req: Request,
  { params }: { params: { matchId: number } }
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!params.matchId) {
      return new NextResponse('Match ID is required', { status: 400 })
    }

    const body = await req.json()
    const { competitorOne, competitorTwo, startedAt, streamChannel } =
      matchUpdateReqSchema.parse(body)


    return await prisma.$transaction(async (tx) => {
      const matchExists = await tx.match.findFirst({
        where: {
          startedAt,
          id: {
            not: Number(params.matchId)
          },
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

      const match = await tx.match.update({
        where: {
          id: Number(params.matchId),
        },
        data: {
          startedAt,
          streamChannel,
          competitors: {
            deleteMany: {},
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
        },
        include: {
          games: true,
        }
      })

      let gameStart = match.startedAt
      const promises: Promise<any>[] = []

      match.games.forEach(game => {
        promises.push(tx.game.update({
          where: {
            id: game.id,
          },
          data: {
            startedAt: gameStart,
          }
        }))

        gameStart = addMinutes(gameStart, 12)
      })

      await Promise.all(promises)

      return NextResponse.json(match)
    })
  } catch (error) {
    console.log('[MATCH_PUT]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { matchId: number } }
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!params.matchId) {
      return new NextResponse('Match ID is required', { status: 400 })
    }

    const body = await req.json()
    const { status } = matchPatchReqSchema.parse(body)

    return await prisma.$transaction(async (tx) => {
      const match = await tx.match.update({
        where: {
          id: Number(params.matchId),
        },
        data: {
          status: status as MatchStatus,
        },
        include: {
          games: {
            take: 1,
            orderBy: {
              id: 'asc',
            },
            select: {
              id: true,
            },
          },
        },
      })

      if (status === MatchStatus.ONGOING) {
        const [game] = match.games
        game && (await updateGameStatus(game.id, GameStatus.ONGOING, match.startedAt, tx))
      }

      return NextResponse.json(match)
    }, { timeout: 5000 })
  } catch (error) {
    console.log('[MATCH_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params: { matchId } }: { params: { matchId: string } }
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!matchId) {
      return new NextResponse('Match ID is required', { status: 400 })
    }

    const match = await prisma.match.findUnique({
      where: {
        id: Number(matchId),
      },
    })

    if (match?.status !== MatchStatus.UPCOMING) {
      return new NextResponse('Only Upcoming matches can be deleted', {
        status: 400,
      })
    }

    const deletedMatch = await prisma.match.delete({
      where: {
        id: Number(matchId),
      },
    })

    return NextResponse.json(deletedMatch)
  } catch (error) {
    console.log('[MATCH_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
