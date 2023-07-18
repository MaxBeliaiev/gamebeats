import { NextResponse } from 'next/server'

import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { tournamentSchema } from '@/lib/schema'
import moment from 'moment'
import { TournamentStatus } from '@prisma/client'

export async function GET(
  req: Request,
  { params }: { params: { tournamentId: number } }
) {
  const session = getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 403 })
  }

  try {
    if (!params.tournamentId) {
      return new NextResponse('Tournament id is required', { status: 400 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: {
        id: params.tournamentId,
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.log('[TOURNAMENT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { tournamentId: number } }
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!params.tournamentId) {
      return new NextResponse('Tournament id is required', { status: 400 })
    }

    const body = await req.json()
    const { name, gameId } = tournamentSchema.parse(body)

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const tournament = await prisma.tournament.update({
      where: {
        id: Number(params.tournamentId),
      },
      data: {
        name,
        gameId,
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.log('[TOURNAMENT_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tournamentId: number } }
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!params.tournamentId) {
      return new NextResponse('Tournament id is required', { status: 400 })
    }

    const tournament = await prisma.tournament.update({
      where: {
        id: Number(params.tournamentId),
      },
      data: {
        status: TournamentStatus.DELETED,
        deletedAt: moment().toDate(),
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.log('[TOURNAMENT_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
