'use client'
import PageLayout from '@/components/page-layout'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import TournamentStatusButtons from '@/app/(dashboard)/tournaments/components/tournament-status-buttons'
import { DataTable } from '@/components/ui/data-table'
import { getMatchColumns } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/columns'

interface TournamentPageClientProps {
  tournament: any
}

const TournamentPageClient = ({ tournament }: TournamentPageClientProps) => {
  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <Heading text={tournament.name} />
        <TournamentStatusButtons tournament={tournament} />
      </div>
      <Separator />
      <DataTable columns={getMatchColumns(tournament)} data={tournament.matches} />
    </PageLayout>
  )
}

export default TournamentPageClient
