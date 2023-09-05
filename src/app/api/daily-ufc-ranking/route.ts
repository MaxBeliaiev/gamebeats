import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function GET() {
  try {
    const ufcRating = await prisma.data.findUnique({
      where: {
        uniqueId: 'ufc_weekly_rating'
      }
    })

    return NextResponse.json({ data: ufcRating, cached: new Date() })
  } catch (error) {
    console.log('[UFC_WEEKLY_RATING_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// export const revalidate = 0