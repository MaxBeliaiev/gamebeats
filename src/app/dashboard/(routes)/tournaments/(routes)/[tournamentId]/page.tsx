import { prisma } from '@/db'

interface TournamentPageProps {
  params: {
    tournamentId: string
  }
}
const TournamentPage = async ({
  params: { tournamentId },
}: TournamentPageProps) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: Number(tournamentId),
    },
    include: {
      matches: {
        include: {
          result: true,
          competitors: {
            include: {
              competitor: true,
            },
          },
        },
      },
    },
  })

  console.log('TOURNAMENT DATA ', tournament)
  console.log('MATCH DATA ', tournament!.matches[0])

  return <div>Tournament page: {tournament?.name}</div>
}

export default TournamentPage
