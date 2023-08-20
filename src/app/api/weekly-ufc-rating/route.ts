import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function GET() {

  try {
    const rating = JSON.stringify({
      data: 'some UFC rating',
      updatedAt: new Date()
    })

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