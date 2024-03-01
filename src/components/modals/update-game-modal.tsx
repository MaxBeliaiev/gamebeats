'use client'

import Modal from '@/components/ui/modal'
import { GameForm } from '@/app/(dashboard)/matches/(routes)/[matchId]/game-form'
import { useUpdateGameModal } from '@/hooks/use-update-game-modal'

export const UpdateGameModal = () => {
  const modal = useUpdateGameModal()

  return (
    <Modal title="Update game" isOpen={modal.isOpen} onClose={modal.close}>
      <GameForm
        onSuccess={modal.close}
        initialData={modal.game}
      />
    </Modal>
  )
}
