'use client'
import PageLayout from '@/app/dashboard/components/page-layout'
import Heading from '@/app/dashboard/components/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import StatusButtons from '@/app/dashboard/(routes)/tournaments/components/status-buttons'

interface TournamentPageClientProps {
  tournament: any
}

const TournamentPageClient = ({ tournament }: TournamentPageClientProps) => {
  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <Heading text={tournament.name} />
        <StatusButtons tournament={tournament} />
      </div>
      <Separator />
    </PageLayout>
  )
}

export default TournamentPageClient
