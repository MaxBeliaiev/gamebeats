import { TournamentForm } from '@/app/dashboard/(routes)/tournaments/components/form'
import Heading from '@/app/dashboard/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'
import { getGames } from '@/lib/services/games'
import { Suspense } from 'react'

const CreateTournament = async () => {
  const games = await getGames()

  return (
    <PageLayout>
      <Heading text="Create new tournament" />
      <Separator />
      <Suspense>
        <TournamentForm games={games} />
      </Suspense>
    </PageLayout>
  )
}

export default CreateTournament
