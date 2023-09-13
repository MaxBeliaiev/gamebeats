'use client'
import PageLayout from '@/components/page-layout'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import TournamentStatusButtons from '@/app/(dashboard)/tournaments/components/tournament-status-buttons'
import { DataTable } from '@/components/ui/data-table'
import { getMatchColumns } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/columns'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useStore from '@/lib/store'

interface TournamentPageClientProps {
  tournament: any
}

const TournamentPageClient = ({ tournament }: TournamentPageClientProps) => {
  const router = useRouter()
  const params = useSearchParams()
  const { currentPage, setPage } = useStore((state) => ({
    currentPage: state.ufc.matches.pagination.page,
    setPage: state.ufc.matches.setPage,
  }))
  console.log('currentPage ', currentPage)
  const page = Number(params.get('page')) || 1
  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <Heading text={tournament.name} />
        <TournamentStatusButtons tournament={tournament} />
      </div>
      <Separator />
      <DataTable
        columns={getMatchColumns(tournament)}
        data={tournament.matches}
        pageCount={tournament.matches.length / 15}
        page={currentPage}
        onPreviousPageClick={() => {
          setPage(currentPage - 1)
          // router.push(`?page=${currentPage - 1}`, { shallow: true })
        }}
        onNextPageClick={() => {
          setPage(currentPage + 1)
          // router.push(`?page=${currentPage + 1}`)
        }}
      />
    </PageLayout>
  )
}

export default TournamentPageClient
