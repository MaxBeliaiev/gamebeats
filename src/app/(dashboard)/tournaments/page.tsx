import { prisma } from '@/db'
import TournamentsClient from '@/app/client'
import { TournamentStatus } from '@prisma/client'

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: {
        not: TournamentStatus.DELETED,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return <TournamentsClient data={tournaments} />
}
export default Dashboard
