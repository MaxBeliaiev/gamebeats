import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { Prisma } from '.prisma/client'
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError
import { tournamentCreateReqSchema } from '@/lib/schemas/tournament'

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const { name, gameId, startedAt } = tournamentCreateReqSchema.parse(body)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        gameId,
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
