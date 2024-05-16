import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { Prisma } from '.prisma/client'
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError
import { tournamentCreateReqSchema } from '@/lib/schemas/tournament'
import { Discipline, TournamentStatus } from '@prisma/client'
import { corsHeaders } from '@/lib/constants/requests'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const take = Number(searchParams.get('size')) || 10
    const page = Number(searchParams.get('page')) || 0
    const status = searchParams.get('status') || null
    const sortBy = searchParams.get('sortBy') || ''
    const sort = searchParams.get('sort') || ''
    const orderBy: any = (sort && sortBy) ? [{ [sortBy]: sort }] : [{ id: 'desc' }]

    const data = await prisma.tournament.findMany({
      take,
      skip: page ? (page - 1) * take : 0,
      where: {
        status: {
          in: status ? [status as TournamentStatus] :
            [TournamentStatus.UPCOMING, TournamentStatus.ONGOING]
        }
      },
      orderBy
    })

    const response = {
      data,
    }

    return NextResponse.json(response, { headers: corsHeaders })
  } catch (error) {
    console.log('[TOURNAMENTS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const { name, disciplineId, startedAt } = tournamentCreateReqSchema.parse(body)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        disciplineId: disciplineId as Discipline,
        startedAt,
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    let errorResp = 'Internal error'
    if (error instanceof PrismaClientKnownRequestError) {
      if (error?.code === 'P2002') {
        errorResp = 'Tournament name must be unique'
      }
    }
    console.log('[TOURNAMENTS_POST]', error)
    return new NextResponse(errorResp, { status: 500 })
  }
}
