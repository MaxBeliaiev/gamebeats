'use client'

import Modal from '@/components/ui/modal'
import { useUpdateMatchModal } from '@/hooks/use-update-match-modal'
import { MatchForm } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/match-form'
import { Competitor } from '@prisma/client'
import { CompetitorsSelectPayload } from '@/lib/constants/competitors'

interface UpdateMatchModalProps {
  competitors: CompetitorsSelectPayload
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
