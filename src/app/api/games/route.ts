import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { GameStatus } from '@prisma/client'
import { corsHeaders } from '@/lib/constants/requests'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const take = Number(searchParams.get('size')) || 10
    const page = Number(searchParams.get('page')) || 0
    const statuses = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || ''
    const sort = searchParams.get('sort') || ''
    const tournamentId = searchParams.get('tournamentId') || ''
    const startedFrom = searchParams.get('startedFrom') || ''
    const startedTo = searchParams.get('startedTo') || ''
    const orderBy: any = (sort && sortBy) ? [{ [sortBy]: sort }] : [{ startedAt: 'asc' }]

    const startedAtQuery = startedFrom ?
        startedTo ? { startedAt: { gte: startedFrom, lte: startedTo } } : { startedAt: startedFrom }
        : {}

    const query = {
      ...(tournamentId && {
        tournamentId: Number(tournamentId),
      }),
      ...(statuses && {
        status: statuses.toUpperCase() as GameStatus,
        //   {
        //   in: statuses?.split(',').map(s => s.toUpperCase()) as Array<MatchStatus>,
        // },
      }),
      ...startedAtQuery,
    }

    const data = await prisma.game.findMany({
      take,
      skip: page ? (page - 1) * take : 0,
      orderBy,
      where: query,
      select: {
        id: true,
        startedAt: true,
        endedAt: true,
        status: true,
        match: {
          select: {
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
                  },
                },
              },
            },
            tournament: {
              select: {
                name: true,
              }
            }
          }
        },
      },
    })

    const response= { data }

    return NextResponse.json(response, { headers: corsHeaders })
  } catch (error) {
    console.log('[GAMES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}
