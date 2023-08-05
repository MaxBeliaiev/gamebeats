import { NextResponse } from 'next/server'

import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { competitorSchema } from '@/lib/schema'
import { CompetitorStatus } from '@prisma/client'

export async function GET(
  req: Request,
  { params }: { params: { competitorId: string } },
) {
  const session = getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 403 })
  }

  try {
    if (!params.competitorId) {
      return new NextResponse('Competitor id is required', { status: 400 })
    }

    const competitor = await prisma.competitor.findUnique({
      where: {
        id: params.competitorId,
      },
    })

    return NextResponse.json(competitor)
  } catch (error) {
    console.log('[COMPETITOR_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { competitorId: string } },
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!params.competitorId) {
      return new NextResponse('Competitor id is required', { status: 400 })
    }

    const body = await req.json()
    const { name, nickname, surname } = competitorSchema.parse(body)

    const competitor = await prisma.competitor.update({
      where: {
        id: params.competitorId,
      },
      data: {
        name,
        nickname,
        surname,
      },
    })

    return NextResponse.json(competitor)
  } catch (error) {
    console.log('[COMPETITOR_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { competitorId: string } },
) {
  try {
    const { competitorId } = params
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!competitorId) {
      return new NextResponse('Competitor id is required', { status: 400 })
    }

    const connectedMatches = await prisma.match.findFirst({
      where: {
        competitorsIds: {
          has: competitorId,
        },
      },
    })

    let competitor
    if (connectedMatches) {
      competitor = await prisma.competitor.update({
        where: {
          id: competitorId,
        },
        data: {
          status: CompetitorStatus.ARCHIVED,
          archivedAt: new Date(),
        },
      })
    } else {
      competitor = await prisma.competitor.delete({
        where: {
          id: competitorId,
        },
      })
    }

    return NextResponse.json(competitor)
  } catch (error) {
    console.log('[COMPETITOR_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
