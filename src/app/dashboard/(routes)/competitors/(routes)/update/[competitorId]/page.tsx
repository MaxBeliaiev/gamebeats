import { CompetitorForm } from '@/app/dashboard/(routes)/competitors/components/form'
import Heading from '@/app/dashboard/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'
import { prisma } from '@/db'

interface UpdateCompetitorProps {
  params: {
    competitorId: string
  }
}

const UpdateCompetitor = async ({
  params: { competitorId },
}: UpdateCompetitorProps) => {
  const competitor = await prisma.competitor.findUnique({
    where: {
      id: Number(competitorId),
    },
  })

  return (
    <PageLayout>
      <Heading text={`Update competitor ${competitor?.name}`} />
      <Separator />
      <CompetitorForm initialData={competitor} competitorId={Number(competitorId)} />
    </PageLayout>
  )
}

export default UpdateCompetitor
