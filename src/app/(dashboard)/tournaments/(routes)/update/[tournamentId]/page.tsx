import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/components/page-layout'
import { prisma } from '@/db'
import { Tournament } from '@prisma/client'
import { TournamentForm } from '@/app/(dashboard)/tournaments/components/form'

const UpdateTournament = async ({
  params: { tournamentId },
}: {
  params: { tournamentId: Tournament['id'] }
}) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: Number(tournamentId),
    },
  })

  return (
    <PageLayout>
      <Heading text={`Update tournament ${tournament?.id}`} />
      <Separator />
      <TournamentForm
        initialData={tournament}
        tournamentId={tournamentId}
      />
    </PageLayout>
  )
}

export default UpdateTournament
