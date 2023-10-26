import {CheckSquare, FileBarChart, Play} from 'lucide-react'
import { Game, GameStatus, Match, MatchStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useFinishGameModal } from '@/hooks/use-finish-game-modal'
import { useUfcLiveResultModal } from '@/hooks/use-ufc-live-result-modal'
import WithTooltip from '@/components/ui/with-tooltip'
import { Button } from '@/components/ui/button'
import { getAxiosErrorMessage } from '@/lib/utils'
import { updateGameStatus } from '@/lib/actions/game'

interface MatchActionsProps {
  match: any
  game: Game
}

const GameActions = ({ match, game }: MatchActionsProps) => {
  const ufcLiveResultModal = useUfcLiveResultModal()
  const handleUpdateLiveResult = () => {
    ufcLiveResultModal.setGame(game)
    ufcLiveResultModal.open()
  }
  return (
    <div className="flex items-center justify-end gap-0.5">
      {
        game.status === GameStatus.ONGOING && (
              <Button
                  variant="ghost"
                  onClick={handleUpdateLiveResult}
              >
                <FileBarChart color="blue" />
              </Button>
          )
      }
      <GameStatusButton match={match} game={game} />
    </div>
  )
}

const GameStatusButton = ({ game, match }: { match: Match; game: Game }) => {
  const { id, status } = game
  const finishGameModal = useFinishGameModal()
  const handleEnterResultClick = () => {
    finishGameModal.setGame(game)
    finishGameModal.open()
  }
  const cannotStart = match.status === MatchStatus.UPCOMING
  const router = useRouter()
  const handleUpdateGameStatus = async (status: GameStatus) => {
    const agree = confirm(
      `Are you sure you want to change game status to ${status}?`
    )
    if (agree) {
      try {
        await updateGameStatus(id, status)
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
        text="Cannot start game if match is Upcoming"
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
      <Button variant="ghost" onClick={handleEnterResultClick}>
        <CheckSquare color="green" />
      </Button>
    )
  }

  return null
}

export default GameActions
