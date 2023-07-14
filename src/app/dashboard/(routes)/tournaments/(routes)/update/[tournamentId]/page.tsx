import Heading from '@/app/dashboard/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'
import { prisma } from '@/db'
import { Tournament } from '@prisma/client'
import { TournamentForm } from '@/app/dashboard/(routes)/tournaments/components/form'
import { getGames } from '@/lib/services/games'

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
  const games = await getGames()

  return (
    <PageLayout>
      <Heading text={`Update tournament ${tournament?.id}`} />
      <Separator />
      <TournamentForm
        initialData={tournament}
        games={games}
        tournamentId={tournamentId}
      />
    </PageLayout>
  )
}

export default UpdateTournament
