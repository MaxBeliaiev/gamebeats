import { prisma } from '@/db'
import TournamentsClient from '@/app/dashboard/client'

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: {
        not: 'DELETED',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return <TournamentsClient data={tournaments} />
}
export default Dashboard
