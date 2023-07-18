'use client'

import Modal from '@/components/ui/modal'
import { useUpdateMatchModal } from '@/hooks/use-update-match-modal'
import { MatchForm } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/match-form'
import { Competitor } from '@prisma/client'

interface UpdateMatchModalProps {
  competitors: Competitor[]
  tournamentId: number
}

export const UpdateMatchModal = ({
  competitors,
  tournamentId,
}: UpdateMatchModalProps) => {
  const modal = useUpdateMatchModal()
  const competitorsData = competitors.map((c) => ({
    label: c.nickname,
    value: String(c.id),
  }))

  return (
    <Modal title="Update match" isOpen={modal.isOpen} onClose={modal.close}>
      <MatchForm
        competitors={competitorsData}
        onSuccess={modal.close}
        initialData={modal.match}
        tournamentId={tournamentId}
      />
    </Modal>
  )
}
