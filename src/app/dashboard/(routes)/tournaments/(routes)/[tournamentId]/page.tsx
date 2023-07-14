import { prisma } from '@/db'
import TournamentPageClient from '@/app/dashboard/(routes)/tournaments/(routes)/[tournamentId]/client'

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

  return <TournamentPageClient tournament={tournament} />
}

export default TournamentPage
