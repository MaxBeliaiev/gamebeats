'use client'
import PageLayout from '@/components/page-layout'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import TournamentStatusButtons from '@/app/(dashboard)/tournaments/components/tournament-status-buttons'
import { DataTable } from '@/components/ui/data-table'
import { getMatchColumns } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/columns'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useStore from '@/lib/store'
import { useMatches } from '@/hooks/use-matches'
import { DEFAULT_MATCHES_PAGE_SIZE } from '@/lib/constants/matches'

interface TournamentPageClientProps {
  tournament: any
}

const TournamentPageClient = ({ tournament }: TournamentPageClientProps) => {
  const { currentPage, setPage } = useStore((state) => ({
    currentPage: state.ufc.matches.pagination.page,
    setPage: state.ufc.matches.setPage,
  }))
  const { data = [], isFetchedAfterMount} = useMatches({
    queryParams: {
      tournamentId: tournament.id,
      page: currentPage,
      size: DEFAULT_MATCHES_PAGE_SIZE,
    },
    initialData: tournament.matches
  })

  // useEffect(() => {
  //   if (isFetchedAfterMount) {
  //     window.scrollTo(0, 0)
  //   }
  // }, [isFetchedAfterMount])

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <Heading text={tournament.name} />
        <TournamentStatusButtons tournament={tournament} />
      </div>
      <Separator />
      <DataTable
        columns={getMatchColumns(tournament)}
        data={data}
        pageSize={DEFAULT_MATCHES_PAGE_SIZE}
        pageCount={tournament.matches.length / DEFAULT_MATCHES_PAGE_SIZE}
        page={currentPage}
        manualPagination
        onPreviousPageClick={() => {
          window.scrollTo(0, 0)
          setPage(currentPage - 1)
        }}
        onNextPageClick={() => {
          window.scrollTo(0, 0)
          setPage(currentPage + 1)
        }}
      />
    </PageLayout>
  )
}

export default TournamentPageClient
