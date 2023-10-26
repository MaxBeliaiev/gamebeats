import { Pencil, Play, XOctagon } from 'lucide-react'
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
import { useQueryClient } from '@tanstack/react-query'
import { parseISO } from 'date-fns'
import { cancelMatch } from '@/lib/actions/match'

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
  const cannotEdit = match.status !== MatchStatus.UPCOMING

  return (
    <div className="flex items-center justify-end gap-0.5">
      <MatchStatusButton match={match} tournament={tournament} />
      <WithTooltip
        text="Cannot edit Ongoing or Finished match"
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
      {
        match.status === MatchStatus.ONGOING && (
          <MatchCancelButton match={match} />
        )
      }
    </div>
  )
}

const MatchStatusButton = ({
  match: { id, status, startedAt },
  tournament,
}: {
  match: Match & {
    startedAt: string
  }
  tournament: Tournament
}) => {
  const cannotStart = parseISO(startedAt) > new Date() || tournament.status === TournamentStatus.UPCOMING
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleUpdateMatchStatus = async (status: string) => {
    const agree = confirm(
      `Are you sure you want to change match status to ${status}?`
    )
    if (agree) {
      try {
        await axios.patch(`/api/matches/${id}`, {
          status,
        })
        await queryClient.invalidateQueries({ queryKey: ['matches'] })
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

  return null
}

const MatchDeleteButton = ({ match: { id, status } }: { match: any }) => {
  const notUpcoming = status !== MatchStatus.UPCOMING
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to delete this match?`)
    if (agree) {
      try {
        await axios.delete(`/api/matches/${id}`)
        await queryClient.invalidateQueries({ queryKey: ['matches'] })

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

const MatchCancelButton = ({ match: { id, status } }: { match: any }) => {
  const notOngoing = status !== MatchStatus.ONGOING
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to cancel this match?`)
    if (agree) {
      try {
        await cancelMatch(Number(id))
        await queryClient.invalidateQueries({ queryKey: ['matches'] })
        router.refresh()
        toast.success(`Match has been successfully canceled!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  return (
    <WithTooltip
      text="Cancel"
      hidden={notOngoing}
    >
    <WithTooltip
      text="Only Ongoing matches can be canceled"
      hidden={!notOngoing}
    >
      <Button variant='ghost' onClick={handleClick} disabled={notOngoing}>
        <XOctagon color="black" />
      </Button>
    </WithTooltip>
    </WithTooltip>
  )
}

export default MatchActions
