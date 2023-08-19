import { prisma } from '@/db'
import TournamentsClient from '@/app/client'

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [
      {
        id: 'desc'
      },
      {
        status: 'desc',
      },
      {
        startedAt: 'asc',
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
