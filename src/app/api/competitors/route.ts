import { NextResponse } from 'next/server'

import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { CompetitorStatus } from '@prisma/client'
import { corsHeaders } from '@/lib/constants/requests'

export async function GET() {
  try {
    const data = await prisma.competitor.findMany({
      where: {
        status: CompetitorStatus.ACTIVE
      }
    })

    return NextResponse.json({ data, cached: new Date() }, { headers: corsHeaders })
  } catch (error) {
    console.log('[COMPETITORS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = getAuthSession()
    const body = await req.json()
    const { name, nickname, surname } = body

    if (!session) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const store = await prisma.competitor.create({
      data: {
        name,
        surname,
        nickname,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[COMPETITORS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
