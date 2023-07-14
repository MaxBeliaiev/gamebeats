import { CompetitorForm } from '@/app/dashboard/(routes)/competitors/components/form'
import Heading from '@/app/dashboard/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'

const CreateCompetitor = () => {
  return (
    <PageLayout>
      <Heading text="Create new competitor" />
      <Separator />
      <CompetitorForm />
    </PageLayout>
  )
}

export default CreateCompetitor
