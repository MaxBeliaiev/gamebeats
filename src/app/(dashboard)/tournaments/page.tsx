import { prisma } from '@/db'
import TournamentsClient from '@/app/client'

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [
      {
        endedAt: 'asc',
      },
      {
        status: 'desc',
      },
      {
        startedAt: 'asc',
      },
      {
        id: 'desc'
      },
    ],
    take: 10,
    include: {
      matches: true,
    },
  })

  return <TournamentsClient data={tournaments} />
}
export default Dashboard
