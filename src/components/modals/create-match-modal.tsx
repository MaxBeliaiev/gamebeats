'use client'

import Modal from '@/components/ui/modal'
import { useCreateMatchModal } from '@/hooks/use-create-match-modal'
import { MatchForm } from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/match-form'
import { Competitor } from '@prisma/client'
import { CompetitorsSelectPayload } from '@/lib/constants/competitors'

interface CreateMatchModalProps {
  competitors: CompetitorsSelectPayload
  tournamentId: number
}

export const CreateMatchModal = ({
  competitors,
  tournamentId,
}: CreateMatchModalProps) => {
  const modal = useCreateMatchModal()
  const competitorsData = competitors.map((c) => ({
    label: c.nickname,
    value: String(c.id),
  }))

  return (
    <Modal title="Create match" isOpen={modal.isOpen} onClose={modal.close}>
      <MatchForm
        competitors={competitorsData}
        tournamentId={tournamentId}
      />
    </Modal>
  )
}
