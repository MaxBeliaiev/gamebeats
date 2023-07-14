'use client'
import { CompetitorForm } from '@/app/dashboard/(routes)/competitors/components/form'
import Heading from '@/app/dashboard/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/app/dashboard/components/page-layout'
import { Suspense } from 'react'

const CreateCompetitor = () => {
  return (
    <PageLayout>
      <Heading text="Create new competitor" />
      <Separator />
      <Suspense>
        <CompetitorForm />
      </Suspense>
    </PageLayout>
  )
}

export default CreateCompetitor
