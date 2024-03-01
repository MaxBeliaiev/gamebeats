'use client'
import PageLayout from '@/components/page-layout'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { getGameColumns } from '@/app/(dashboard)/matches/(routes)/[matchId]/columns'
import Link from 'next/link'
import MatchStatusButtons from '@/app/(dashboard)/matches/(routes)/[matchId]/match-status-buttons'

interface MatchPageClientProps {
  match: any
}

const MatchPageClient = ({ match }: MatchPageClientProps) => {
  const { tournamentId, competitors, games } = match
  const [c1, c2] = competitors

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <Heading
          text={
            <Link
              className={'font-semibold hover:underline'}
              href={{ pathname: `/tournaments/${tournamentId}` }}
              prefetch={false}
            >
              {c1.competitor.nickname} vs. {c2.competitor.nickname}
            </Link>
          }
        />
        <MatchStatusButtons match={match} />
      </div>
      <Separator />
      <DataTable columns={getGameColumns(match)} data={games} />
    </PageLayout>
  )
}

export default MatchPageClient
