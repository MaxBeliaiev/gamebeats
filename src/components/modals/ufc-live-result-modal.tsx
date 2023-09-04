'use client'

import Modal from '@/components/ui/modal'
import { UfcLiveResultForm } from '@/app/(dashboard)/matches/(routes)/[matchId]/ufc-live-result-form'
import { useUfcLiveResultModal } from '@/hooks/use-ufc-live-result-modal'

interface UfcLiveResultModalProps {
  competitors: Array<{nickname: string, id: number}>
}

export const UfcLiveResultModal = ({
  competitors,
}: UfcLiveResultModalProps) => {
  const modal = useUfcLiveResultModal()
  const competitorsData = competitors.map((c) => ({
    label: c.nickname,
    value: String(c.id),
  }))

  return (
    <Modal title="Enter UFC live result" isOpen={modal.isOpen} onClose={modal.close}>
      <UfcLiveResultForm
        competitors={competitorsData}
        onSuccess={modal.close}
        game={modal.game}
      />
    </Modal>
  )
}
