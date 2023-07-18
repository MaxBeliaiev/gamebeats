import { prisma } from '@/db'
import TournamentsClient from '@/app/client'

const Dashboard = async () => {
  const tournaments = await prisma.tournament.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return <TournamentsClient data={tournaments} />
}
export default Dashboard
