import { CheckSquare, Play, Plus, StopCircle } from 'lucide-react'
import {
  Game,
  GameStatus,
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
import { updateMatchStatus } from '@/lib/actions/game'

interface MatchActionsProps {
  match: any
  game: Game
}

const GameActions = ({ match, game }: MatchActionsProps) => {
  const updateMatchModal = useUpdateMatchModal()
  const handleUpdateClick = () => {
    updateMatchModal.setMatch(match)
    updateMatchModal.open()
  }
  const cannotEdit = match.status === MatchStatus.ONGOING

  return (
    <div className="flex items-center justify-end gap-0.5">
      <GameStatusButton match={match} game={game} />
      <WithTooltip text="Cannot edit Ongoing match" hidden={!cannotEdit}>
        <Button
          variant="ghost"
          onClick={handleUpdateClick}
          disabled={cannotEdit}
        >
          <Plus color="blue" />
        </Button>
      </WithTooltip>
      {/*<MatchDeleteButton match={match} />*/}
    </div>
  )
}

const GameStatusButton = ({
  game: { id, status },
  match,
}: {
  match: Match
  game: Game
}) => {
  const cannotStart = match.status === MatchStatus.UPCOMING
  const router = useRouter()
  const handleUpdateGameStatus = async (status: GameStatus) => {
    const agree = confirm(
      `Are you sure you want to change game status to ${status}?`
    )
    if (agree) {
      try {
        await updateMatchStatus(id, status)
        router.refresh()
        toast.success(`Game is ${status.toLowerCase()} now!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  if (status === GameStatus.UPCOMING) {
    return (
      <WithTooltip
        text="Cannot start match if match is Upcoming"
        hidden={!cannotStart}
      >
        <Button
          variant="ghost"
          onClick={() => handleUpdateGameStatus(GameStatus.ONGOING)}
          disabled={cannotStart}
        >
          <Play color="green" />
        </Button>
      </WithTooltip>
    )
  }

  if (status === MatchStatus.ONGOING) {
    return (
      <Button
        variant="ghost"
        onClick={() => handleUpdateGameStatus(MatchStatus.FINISHED)}
        disabled={cannotStart}
      >
        <CheckSquare color="red" />
      </Button>
    )
  }

  return null
}

// const MatchDeleteButton = ({ match: { id, status } }: { match: any }) => {
//   const notUpcoming = status !== MatchStatus.UPCOMING
//   const router = useRouter()
//   const handleClick = async () => {
//     const agree = confirm(`Are you sure you want to delete this match?`)
//     if (agree) {
//       try {
//         await axios.delete(`/api/matches/${id}`)
//         router.refresh()
//         toast.success(`Match has been successfully deleted!`)
//       } catch (e: any) {
//         toast.error(getAxiosErrorMessage(e))
//       }
//     }
//   }
//
//   return (
//     <WithTooltip
//       text="Only Upcoming matches can be deleted"
//       hidden={!notUpcoming}
//     >
//       <DeleteButton onClick={handleClick} disabled={notUpcoming} />
//     </WithTooltip>
//   )
// }

export default GameActions
