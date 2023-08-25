'use client'

import { useEffect, useState } from 'react'
import { UfcLiveResultModal } from '@/components/modals/ufc-live-result-modal'

interface UfcLiveResultModalProviderProps {
  competitors: Array<{nickname: string, id: number}>
}

export const UfcLiveResultModalProvider = ({ competitors }: UfcLiveResultModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <UfcLiveResultModal competitors={competitors} />
}
