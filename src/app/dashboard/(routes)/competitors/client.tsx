'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/app/dashboard/(routes)/competitors/columns'
import { useRouter } from 'next/navigation'
import Heading from '@/app/dashboard/components/heading'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'
import { Competitor } from '@prisma/client'

interface CompetitorsClientProps {
  data: Competitor[]
}

const CompetitorsClient = ({ data }: CompetitorsClientProps) => {
  const router = useRouter()

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <Heading text="Competitors" />
        <Button onClick={() => router.push('/dashboard/competitors/new')}>
          <Plus className="mr-1" size={20} />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </PageLayout>
  )
}

export default CompetitorsClient
