import { TournamentForm } from '@/app/(dashboard)/tournaments/components/form'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/components/page-layout'
import { Suspense } from 'react'
import { prisma } from '@/db'

const CreateTournament = async () => {
  const games = await prisma.game.findMany()

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
