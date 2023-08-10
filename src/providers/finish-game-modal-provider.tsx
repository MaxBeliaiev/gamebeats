'use client'

import { useEffect, useState } from 'react'
import { FinishGameModal } from '@/components/modals/finish-game-modal'

interface FinishGameModalProviderProps {
  competitors: Array<{nickname: string, id: number}>
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
