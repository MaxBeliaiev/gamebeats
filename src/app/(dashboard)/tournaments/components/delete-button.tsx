'use client'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Match, MatchStatus, Tournament } from '@prisma/client'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/ui/delete-button'
import { Button } from '@/components/ui/button'
import WithTooltip from '@/components/ui/with-tooltip'
const TournamentDeleteButton = ({
  tournament: { name, id, matches },
}: {
  tournament: Tournament & {
    matches?: Match[]
  }
}) => {
  const router = useRouter()
  const disabled = matches?.some(
    (match) => match.status !== MatchStatus.UPCOMING
  )

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

  return (
    <WithTooltip
      text="Cannot delete tournament with ongoing/finished matches in it"
      hidden={!disabled}
    >
      <DeleteButton onClick={handleClick} disabled={disabled} />
    </WithTooltip>
  )
}

export default TournamentDeleteButton
