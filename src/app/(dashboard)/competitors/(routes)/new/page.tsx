'use client'
import { CompetitorForm } from '@/app/(dashboard)/competitors/components/form'
import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import PageLayout from '@/components/page-layout'
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
