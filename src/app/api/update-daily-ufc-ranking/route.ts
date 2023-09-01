import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import {getUtcStartOfMonth} from "@/lib/helpers/date";
import {CompetitorStatus} from "@prisma/client";
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const competitors = await prisma.competitor.findMany({
      where: {
        status: {
          not: CompetitorStatus.ARCHIVED,
        },
      },
      select: {
        name: true,
        surname: true,
        nickname: true,
        ufcStats: {
          where: {
            periodStartedAt: getUtcStartOfMonth()
          },
          select: {
            wins: true,
            games: true,
            losses: true,
            knockouts: true,
            decisions: true,
            submissions: true,
            draws: true,
          }
        }
      }
    })

    const filteredCompetitors = competitors.filter(competitor => Boolean(competitor.ufcStats.length))

    const result = filteredCompetitors.map(competitor => {
      const currentStats = competitor.ufcStats[0]
      const { wins, games } = currentStats
      const winRate = wins / games
      return {
        ...competitor,
        ufcStats: {
          ...currentStats,
          winRate: Number(winRate.toFixed(2)),
        }
      }
    }).sort((a, b) => b.ufcStats.winRate - a.ufcStats.winRate)


    const dataset = await prisma.data.upsert({
      where: {
        uniqueId: 'ufc_weekly_rating'
      },
      update: {
        json: result,
      },
      create: {
        uniqueId: 'ufc_weekly_rating',
        json: result,
      },
      select: {
        json: true,
        updatedAt: true,
      }
    })

    revalidatePath('/api/weekly-ufc-rating')

    return new Response(JSON.stringify(dataset), {
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