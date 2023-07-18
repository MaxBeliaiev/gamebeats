'use client'
import { useCreateMatchModal } from '@/hooks/use-create-match-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const ActionsHeader = () => {
  const createMatchModal = useCreateMatchModal()

  return (
    <div className="flex items-center justify-end">
      <Button className="self-end" onClick={createMatchModal.open}>
        <Plus className="mr-1" size={20} />
        Add match
      </Button>
    </div>
  )
}

export default ActionsHeader
