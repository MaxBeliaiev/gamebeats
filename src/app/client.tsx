'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/app/(dashboard)/tournaments/columns'
import { useRouter } from 'next/navigation'
import Heading from '@/components/heading'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/components/page-layout'
import { Tournament } from '@prisma/client'
import { useEffect } from 'react'
import axios from 'axios'

interface TournamentsClientProps {
  data: Tournament[]
}

const TournamentsClient = ({ data }: TournamentsClientProps) => {
  const router = useRouter()

  return (
    <PageLayout>
      <div className="flex justify-between items-center" suppressHydrationWarning={true}>
        <Heading text="Tournaments" />
        <Button onClick={() => router.push('/tournaments/new')}>
          <Plus className="mr-1" size={20} />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </PageLayout>
  )
}

export default TournamentsClient
