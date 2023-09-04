'use client'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Match, Tournament, TournamentStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/ui/delete-button'
import WithTooltip from '@/components/ui/with-tooltip'
import { getAxiosErrorMessage } from '@/lib/utils'
const TournamentDeleteButton = ({
  tournament: { name, id, status },
}: {
  tournament: Tournament & {
    matches?: Match[]
  }
}) => {
  const router = useRouter()
  const disabled = status !== TournamentStatus.UPCOMING

  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to delete tournament ${name}?`)
    if (agree) {
      try {
        await axios.delete(`/api/tournaments/${id}`)
        router.refresh()
        toast.success(`Tournament ${name} has been successfully deleted!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  return (
    <WithTooltip
      text="Cannot delete ongoing/finished tournament"
      hidden={!disabled}
    >
      <DeleteButton onClick={handleClick} disabled={disabled} />
    </WithTooltip>
  )
}

export default TournamentDeleteButton
