import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchPatchReqSchema, matchUpdateReqSchema } from '@/lib/schemas/match'
import { MatchStatus } from '@prisma/client'

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
    const { competitorOne, competitorTwo, startedAt, status } =
      matchUpdateReqSchema.parse(body)

    const match = await prisma.match.update({
      where: {
        id: Number(params.matchId),
      },
      data: {
        ...(status === MatchStatus.FINISHED && { endedAt: new Date() }),
        startedAt,
        competitors: {
          deleteMany: {},
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
      },
    })

    return NextResponse.json(match)
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

    const match = await prisma.match.update({
      where: {
        id: Number(params.matchId),
      },
      data: {
        status: status as MatchStatus,
      },
    })

    return NextResponse.json(match)
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
