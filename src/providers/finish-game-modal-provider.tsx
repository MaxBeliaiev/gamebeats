'use client'

import { useEffect, useState } from 'react'
import { CreateMatchModal } from '@/components/modals/create-match-modal'
import { Competitor } from '@prisma/client'
import { FinishGameModal } from '@/components/modals/finish-game-modal'

interface FinishGameModalProviderProps {
  competitors: Competitor[]
}

export const FinishGameModalProvider = ({ competitors }: FinishGameModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <FinishGameModal competitors={competitors} />
}
