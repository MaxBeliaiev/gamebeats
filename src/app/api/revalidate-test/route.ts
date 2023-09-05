import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function GET(req: Request) {
  try {
    // let fullFields = Boolean(getAuthSession())
    const { searchParams } = new URL(req.url)

    // const take = Number(searchParams.get('size')) || 10
    // const page = Number(searchParams.get('page')) || 0

    const data = await prisma.match.findMany({
      take: 10,
      // skip: page ? (page - 1) * take : 0,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        startedAt: true,
        status: true,
        competitors: {
          orderBy: {
            order: 'asc',
          },
          select: {
            order: true,
            score: true,
            competitor: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ data, cached: new Date() })
  } catch (error) {
    console.log('[MATCHES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}