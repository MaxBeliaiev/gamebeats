'use client'

import { useEffect, useState } from 'react'
import { CreateMatchModal } from '@/components/modals/create-match-modal'
import { Competitor } from '@prisma/client'

interface CreateMatchModalProviderProps {
  competitors: Competitor[]
  tournamentId: number
}

export const CreateMatchModalProvider = ({ competitors, tournamentId }: CreateMatchModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <CreateMatchModal competitors={competitors} tournamentId={tournamentId} />
}
