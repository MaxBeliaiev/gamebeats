import { prisma } from '@/db'

export const fetchTournament = async (id: string) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id,
    },
    include: {
      matches: {
        orderBy: [
          {
            status: 'asc',
          },
          {
            startedAt: 'desc',
          },
        ],
      },
    },
  })

  const competitorsIds: Array<string> = []

  tournament?.matches.forEach(match => {
    match.competitorsIds.forEach(id => {
      competitorsIds.push(id)
    })
  })

  const competitors = await prisma.competitor.findMany({
    where: {
      id: {
        in: competitorsIds,
      },
    },
  })

  return {
    ...tournament,
    matches: tournament?.matches.map(match => ({
      ...match,
      competitors: match.competitorsIds.map(id => competitors.find(c => c.id === id)),
    })),
  }
}