import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { matchUpdateReqSchema } from '@/lib/schemas/match'
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
        status: status as MatchStatus,
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
    console.log('[MATCH_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
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

    const match = await prisma.match.update({
      where: {
        id: Number(params.matchId),
      },
      data: {
        status: MatchStatus.DELETED,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.log('[MATCH_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
