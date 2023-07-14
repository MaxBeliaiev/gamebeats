import { TournamentForm } from '@/app/dashboard/(routes)/tournaments/components/form'
import Heading from '@/app/dashboard/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'
import { getGames } from '@/lib/services/games'

const CreateTournament = async () => {
  const games = await getGames()

  return (
    <PageLayout>
      <Heading text="Create new tournament" />
      <Separator />
      <TournamentForm games={games} />
    </PageLayout>
  )
}

export default CreateTournament
