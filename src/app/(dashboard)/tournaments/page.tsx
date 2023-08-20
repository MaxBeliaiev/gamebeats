import { prisma } from '@/db'
import TournamentsClient from '@/app/client'
import {Tournament, TournamentStatus} from "@prisma/client";

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [
      {
        startedAt: 'asc',
      },
    ],
    take: 10,
    include: {
      matches: true,
    },
  })

  console.log('test')
  const sortedTournaments = tournaments.sort((a: Tournament, b: Tournament) => {
    if (a.status === TournamentStatus.ONGOING) {
      return -1
    }
    if (b.status === TournamentStatus.ONGOING) {
      return 1
    }
    if (a.status === TournamentStatus.FINISHED) {
      return b.status !== TournamentStatus.FINISHED ? 1 : b.id - a.id
    }
    if (b.status === TournamentStatus.FINISHED) {
      return -1
    }

    return 0
  })

  return <TournamentsClient data={sortedTournaments} />
}
export default Dashboard
