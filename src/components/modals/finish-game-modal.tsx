'use client'

import Modal from '@/components/ui/modal'
import { FinishGameForm } from '@/app/(dashboard)/matches/(routes)/[matchId]/finish-game-form'
import { useFinishGameModal } from '@/hooks/use-finish-game-modal'

interface FinishGameModalProps {
  competitors: Array<{nickname: string, id: number}>
}

export const FinishGameModal = ({
  competitors,
}: FinishGameModalProps) => {
  const modal = useFinishGameModal()
  const competitorsData = competitors.map((c) => ({
    label: c.nickname,
    value: String(c.id),
  }))

  return (
    <Modal title="Finish game" isOpen={modal.isOpen} onClose={modal.close}>
      <FinishGameForm
        competitors={competitorsData}
        onSuccess={modal.close}
        initialData={modal.game}
      />
    </Modal>
  )
}
