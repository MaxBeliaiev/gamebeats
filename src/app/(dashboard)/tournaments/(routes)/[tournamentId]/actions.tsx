import Link from 'next/link'
import { Pencil } from 'lucide-react'
import TournamentDeleteButton from '@/app/(dashboard)/tournaments/components/delete-button'
import { Tournament } from '@prisma/client'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import DeleteButton from '@/components/ui/delete-button'
import { useUpdateMatchModal } from '@/hooks/use-update-match-modal'

interface MatchActionsProps {
  match: any
}

const MatchActions = ({ match }: MatchActionsProps) => {
  const updateMatchModal = useUpdateMatchModal()
  const handleUpdateClick = () => {
    updateMatchModal.setMatch(match)
    updateMatchModal.open()
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Pencil className='cursor-pointer' color="blue" onClick={handleUpdateClick} />
      <MatchDeleteButton match={match} />
    </div>
  )
}

const MatchDeleteButton = ({ match: { id } }: { match: any }) => {
  const router = useRouter()
  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to delete this match?`)
    if (agree) {
      try {
        await axios.delete(`/api/matches/${id}`)
        router.refresh()
        toast.success(`Match has been successfully deleted!`)
      } catch (e: any) {
        toast.error('Something went wrong.')
      }
    }
  }

  return <DeleteButton onClick={handleClick} />
}

export default MatchActions
