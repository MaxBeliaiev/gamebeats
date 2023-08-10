import { CheckSquare, Pencil, Play, StopCircle } from 'lucide-react'
import {
  Match,
  MatchStatus,
  Tournament,
  TournamentStatus,
} from '@prisma/client'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import DeleteButton from '@/components/ui/delete-button'
import { useUpdateMatchModal } from '@/hooks/use-update-match-modal'
import WithTooltip from '@/components/ui/with-tooltip'
import { Button } from '@/components/ui/button'
import { getAxiosErrorMessage } from '@/lib/utils'

interface MatchActionsProps {
  match: any
  tournament: Tournament
}

const MatchActions = ({ match, tournament }: MatchActionsProps) => {
  const updateMatchModal = useUpdateMatchModal()
  const handleUpdateClick = () => {
    updateMatchModal.setMatch(match)
    updateMatchModal.open()
  }
  const cannotEdit = match.status === MatchStatus.ONGOING

  return (
    <div className="flex items-center justify-end gap-0.5">
      <MatchStatusButton match={match} tournament={tournament} />
      <WithTooltip
        text="Cannot edit Ongoing match"
        hidden={!cannotEdit}
      >
        <Button
          variant="ghost"
          onClick={handleUpdateClick}
          disabled={cannotEdit}
        >
          <Pencil color="blue" />
        </Button>
      </WithTooltip>
      <MatchDeleteButton match={match} />
    </div>
  )
}

const MatchStatusButton = ({
  match: { id, status, startedAt },
  tournament,
}: {
  match: Match
  tournament: Tournament
}) => {
  const cannotStart =
    startedAt > new Date() || tournament.status === TournamentStatus.UPCOMING
  const router = useRouter()
  const handleUpdateMatchStatus = async (status: string) => {
    const agree = confirm(
      `Are you sure you want to change match status to ${status}?`
    )
    if (agree) {
      try {
        await axios.patch(`/api/matches/${id}`, {
          status,
        })
        router.refresh()
        toast.success(`Match has been successfully updated!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  if (status === MatchStatus.UPCOMING) {
    return (
      <WithTooltip
        text="Cannot start match if tournament is Upcoming or start time is in the future"
        hidden={!cannotStart}
      >
        <Button
          variant="ghost"
          onClick={() => handleUpdateMatchStatus(MatchStatus.ONGOING)}
          disabled={cannotStart}
        >
          <Play color="green" />
        </Button>
      </WithTooltip>
    )
  }

  // if (status === MatchStatus.ONGOING) {
  //   return (
  //     <Button
  //       variant="ghost"
  //       onClick={() => handleUpdateMatchStatus(MatchStatus.FINISHED)}
  //       disabled={cannotStart}
  //     >
  //       <CheckSquare color="red" />
  //     </Button>
  //   )
  // }

  return null
}

const MatchDeleteButton = ({ match: { id, status } }: { match: any }) => {
  const notUpcoming = status !== MatchStatus.UPCOMING
  const router = useRouter()
  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to delete this match?`)
    if (agree) {
      try {
        await axios.delete(`/api/matches/${id}`)
        router.refresh()
        toast.success(`Match has been successfully deleted!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  return (
    <WithTooltip
      text="Only Upcoming matches can be deleted"
      hidden={!notUpcoming}
    >
      <DeleteButton onClick={handleClick} disabled={notUpcoming} />
    </WithTooltip>
  )
}

export default MatchActions
