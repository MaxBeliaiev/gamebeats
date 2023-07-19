import { prisma } from '@/db'
import TournamentsClient from '@/app/client'

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [
      {
        status: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
    include: {
      matches: true,
    },
  })
  return <TournamentsClient data={tournaments} />
}
export default Dashboard
