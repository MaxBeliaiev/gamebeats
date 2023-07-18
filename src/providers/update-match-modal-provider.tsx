'use client'

import { useEffect, useState } from 'react'
import { UpdateMatchModal } from '@/components/modals/update-match-modal'
import { Competitor } from '@prisma/client'

interface UpdateMatchModalProviderProps {
  competitors: Competitor[]
  tournamentId: number
}

export const UpdateMatchModalProvider = ({ competitors, tournamentId }: UpdateMatchModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <UpdateMatchModal competitors={competitors} tournamentId={tournamentId} />
}
