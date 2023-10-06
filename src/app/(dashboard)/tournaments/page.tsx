import { prisma } from '@/db'
import TournamentsClient from '@/app/client'
import {Tournament, TournamentStatus} from "@prisma/client";

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [
      {
        status: 'asc',
      },
      {
        endedAt: 'desc'
      },
      {
        startedAt: 'asc',
      },
    ],
    take: 14,
  })

  const { ONGOING, FINISHED } = TournamentStatus

  tournaments.sort((a: Tournament, b: Tournament) => {
    if (a.status === ONGOING || (b.status === FINISHED && a.status !== FINISHED)) {
      return -1
    }
    if (b.status === ONGOING || (a.status === FINISHED &&  b.status !== FINISHED)) {
      return 1
    }

    return 0
  })

  return <TournamentsClient data={tournaments} />
}
export default Dashboard
