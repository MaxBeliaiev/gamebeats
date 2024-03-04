import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { corsHeaders } from '@/lib/constants/requests'

export async function GET() {
  try {
    const ufcRating = await prisma.data.findUnique({
      where: {
        uniqueId: 'ufc_weekly_rating'
      }
    })

    return NextResponse.json({ data: ufcRating, cached: new Date() }, { headers: corsHeaders })
  } catch (error) {
    console.log('[UFC_WEEKLY_RATING_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export const revalidate = 0