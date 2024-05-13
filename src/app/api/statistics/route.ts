import { NextResponse } from "next/server"
import { prisma } from "@/db"
import { corsHeaders } from "@/lib/constants/requests"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const tournamentId = searchParams.get("tournamentId") || ""
    const competitorId = searchParams.get("competitorId") || ""
    const startedFrom = searchParams.get("startedFrom") || ""
    const startedTo = searchParams.get("startedTo") || ""

    const startedAtQuery = startedFrom
      ? startedTo
        ? { periodStartedAt: { gte: startedFrom, lte: startedTo } }
        : { periodStartedAt: startedFrom }
      : {}

    const query = {
      ...(tournamentId && {
        tournamentId: Number(tournamentId),
      }),
      ...(competitorId && {
        competitorId: Number(competitorId),
      }),
      ...startedAtQuery,
    }

    const data = await prisma.ufcCompetitorStats.findMany({
      where: query,
      select: {
        id: true,
        periodStartedAt: true,
        games: true,
        wins: true,
        losses: true,
        knockouts: true,
        decisions: true,
        draws: true,
        splitDecisions: true,
        submissions: true,
        competitorId: true,
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const response = { data }

    return NextResponse.json(response, { headers: corsHeaders })
  } catch (error) {
    console.log("[UFC_STATISTICS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
