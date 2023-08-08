import { TournamentForm } from '@/app/(dashboard)/tournaments/components/form'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/components/page-layout'

const CreateTournament = async () => (
  <PageLayout>
    <Heading text="Create new tournament" />
    <Separator />
    <TournamentForm />
  </PageLayout>
)

export default CreateTournament
