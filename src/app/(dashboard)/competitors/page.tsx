import { prisma } from '@/db'
import CompetitorsClient from '@/app/(dashboard)/competitors/client'

const Competitors = async () => {
  const competitors = await prisma.competitor.findMany({
    where: {
      status: 'ACTIVE',
    },
  })

  return <CompetitorsClient data={competitors} />
}

export default Competitors
