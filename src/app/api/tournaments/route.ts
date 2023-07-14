import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { tournamentSchema } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const { name, gameId } = tournamentSchema.parse(body)

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
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.log('[TOURNAMENTS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
