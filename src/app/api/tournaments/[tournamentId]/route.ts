import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { tournamentUpdateReqSchema } from '@/lib/schemas/tournament'
import { MatchStatus, TournamentStatus } from '@prisma/client'

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
  { params: { tournamentId } }: { params: { tournamentId: number } }
) {
  try {
    const session = getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!tournamentId) {
      return new NextResponse('Tournament ID is required', { status: 400 })
    }

    const body = await req.json()
    const { name, disciplineId, startedAt, status } =
      tournamentUpdateReqSchema.parse(body)

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (status && status !== TournamentStatus.ONGOING) {
      const matches = await prisma.match.findMany({
        where: {
          tournamentId: Number(tournamentId),
        },
      })

      if (
        status === TournamentStatus.UPCOMING &&
        matches.some((match) => match.status !== MatchStatus.UPCOMING)
      ) {
        return new NextResponse(
          'Cannot make tournament Upcoming with ongoing/finished matches in it',
          { status: 400 }
        )
      } else if (
        status === TournamentStatus.FINISHED &&
        matches.some((match) => match.status !== MatchStatus.FINISHED)
      ) {
        return new NextResponse(
          'Cannot finish tournament with unfinished matches in it',
          { status: 400 }
        )
      }
    }

    const tournament = await prisma.tournament.update({
      where: {
        id: Number(tournamentId),
      },
      data: {
        name,
        disciplineId,
        startedAt,
        status: status as TournamentStatus,
        ...(status === TournamentStatus.FINISHED && { endedAt: new Date() }),
        ...(status === TournamentStatus.ONGOING && { endedAt: null }),
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
      return new NextResponse('Tournament ID is required', { status: 400 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: {
        id: Number(params.tournamentId),
      },
    })

    if (!tournament) {
      return new NextResponse('No tournament found', { status: 404 })
    }

    if (tournament.status !== TournamentStatus.UPCOMING) {
      return new NextResponse('Only Upcoming tournaments can be deleted', {
        status: 400,
      })
    }

    const deletedTournament = await prisma.tournament.delete({
      where: {
        id: tournament.id,
      },
    })

    return NextResponse.json(deletedTournament)
  } catch (error) {
    console.log('[TOURNAMENT_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
