'use client'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Tournament } from '@prisma/client'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/ui/delete-button'
const TournamentDeleteButton = ({
  tournament: { name, id },
}: {
  tournament: Tournament
}) => {
  const router = useRouter()
  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to delete tournament ${name}?`)
    if (agree) {
      try {
        await axios.delete(`/api/tournaments/${id}`)
        router.refresh()
        toast.success(`Tournament ${name} has been successfully deleted!`)
      } catch (e: any) {
        toast.error('Something went wrong.')
      }
    }
  }

  return <DeleteButton onClick={handleClick} />
}

export default TournamentDeleteButton
