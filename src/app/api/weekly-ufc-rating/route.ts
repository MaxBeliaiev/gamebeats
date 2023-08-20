import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'
import { Prisma } from '.prisma/client'
import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError
import { tournamentCreateReqSchema } from '@/lib/schemas/tournament'
import { Discipline } from '@prisma/client'

export async function GET() {

  try {
    const rating = {
      data: 'some UFC rating',
      updatedAt: new Date()
    }

    await prisma.data.upsert({
      where: {
        uniqueId: 'ufc_weekly_rating'
      },
      update: {
        json: rating,
      },
      create: {
        uniqueId: 'ufc_weekly_rating',
        json: rating,
      },
    },)

    return NextResponse.json(rating)
  } catch (error) {
    console.log('[UFC_WEEKLY_RATING_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}