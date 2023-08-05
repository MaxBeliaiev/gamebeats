import { TournamentForm } from '@/app/(dashboard)/tournaments/components/form'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/components/page-layout'
import { prisma } from '@/db'

const CreateTournament = async () => {
  const games = await prisma.discipline.findMany()

  return (
    <PageLayout>
      <Heading text="Create new tournament" />
      <Separator />
      <TournamentForm games={games} />
    </PageLayout>
  )
}

export default CreateTournament
