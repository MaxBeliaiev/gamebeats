'use client'
import PageLayout from '@/components/page-layout'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import TournamentStatusButtons from '@/app/(dashboard)/tournaments/components/tournament-status-buttons'
import { DataTable } from '@/components/ui/data-table'
import { getMatchColumns } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/columns'
import useStore from '@/lib/store'
import { useMatches } from '@/hooks/use-matches'
import { DEFAULT_MATCHES_PAGE_SIZE } from '@/lib/constants/matches'
import {useEffect, useState} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Filters from "@/app/(dashboard)/tournaments/(routes)/[tournamentId]/filters";
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCreateMatchModal } from '@/hooks/use-create-match-modal'

interface TournamentPageClientProps {
  tournament: any
}

const TournamentPageClient = ({ tournament }: TournamentPageClientProps) => {
  const { currentPage, setPage} = useStore((state) => ({
    currentPage: state.ufc.matches.pagination.page,
    setPage: state.ufc.matches.setPage,
  }))
  const [filters, setFilters] = useState(null)
  const { data: { data: matches = [], pagination }} = useMatches({
    queryParams: {
      tournamentId: tournament.id,
      page: currentPage,
      size: DEFAULT_MATCHES_PAGE_SIZE,
    },
    filters,
    initialData: { data: [], pagination: { total: 0 } }
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const queryPage = searchParams.get('page')
  const handleApplyFilters = (values: any) => {
    setFilters(values)
  }

  const createMatchModal = useCreateMatchModal()

  useEffect(() => {
    if (queryPage !== null) {
      setPage(Number(queryPage))
      router.replace(pathname)
    }
  }, [queryPage, pathname, setPage, router])

  return (
    <PageLayout>
      <Button className="fixed bottom-[50px] right-[300px]" onClick={createMatchModal.open}>
        <Plus className="mr-1" size={20} />
        Add match
      </Button>
      <div className="flex justify-between items-center">
        <Heading text={tournament.name} />
        <Filters onApply={handleApplyFilters} />
        <TournamentStatusButtons tournament={tournament} />
      </div>
      <Separator />
      <DataTable
        wrapperClassName='overflow-visible'
        columns={getMatchColumns(tournament)}
        data={matches}
        pageSize={DEFAULT_MATCHES_PAGE_SIZE}
        pageCount={pagination.total / DEFAULT_MATCHES_PAGE_SIZE}
        page={currentPage}
        manualPagination
        headersConfig={{
          actions: { className: 'sticky top-3'}
        }}
        onPageChange={(page: number) => {
          window.scrollTo(0, 0)
          setPage(page)
        }}
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
