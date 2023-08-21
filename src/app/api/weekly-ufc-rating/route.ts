import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function GET() {
  try {
    const rating = {
      data: 'some UFC rating',
      updatedAt: new Date()
    }

    const updatedRating = await prisma.data.upsert({
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

    return new Response(JSON.stringify(updatedRating), {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    // return NextResponse.json({ resp: updatedRating })
  } catch (error) {
    console.log('[UFC_WEEKLY_RATING_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export const fetchCache = 'force-no-store';
// OR
export const revalidate = 0;