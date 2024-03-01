'use client'

import { useEffect, useState } from 'react'
import { UpdateGameModal } from '@/components/modals/update-game-modal'


export const UpdateGameModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <UpdateGameModal />
}
