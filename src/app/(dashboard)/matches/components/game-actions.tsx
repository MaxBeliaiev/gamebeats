import { CheckSquare, FileBarChart, RefreshCcw, Play, Pencil, XOctagon } from 'lucide-react'
import { Game, GameStatus, Match, MatchStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useFinishGameModal } from '@/hooks/use-finish-game-modal'
import { useUfcLiveResultModal } from '@/hooks/use-ufc-live-result-modal'
import WithTooltip from '@/components/ui/with-tooltip'
import { Button } from '@/components/ui/button'
import { getAxiosErrorMessage } from '@/lib/utils'
import { refreshGame, updateGameStatus } from '@/lib/actions/game'
import { useUpdateGameModal } from '@/hooks/use-update-game-modal'
import { cancelGame } from '@/lib/actions/game'

interface MatchActionsProps {
  match: any
  game: Game
}

const GameActions = ({ match, game }: MatchActionsProps) => {
  const router = useRouter()
  const ufcLiveResultModal = useUfcLiveResultModal()

  const handleUpdateLiveResult = () => {
    ufcLiveResultModal.setGame(game)
    ufcLiveResultModal.open()
  }

  const handleRefreshGame = async () => {
    const agree = confirm(
      `Are you sure you want to reset this game?`,
    )
    if (agree) {
      try {
        await refreshGame(game.id)
        router.refresh()
        toast.success(`Game has been reset!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  return (
    <div className='flex items-center justify-end gap-0.5'>
      {
        game.status === GameStatus.ONGOING && (
          <>
            <Button
              variant='ghost'
              onClick={handleUpdateLiveResult}
            >
              <FileBarChart color='blue' />
            </Button>
            <Button
              variant='ghost'
              onClick={handleRefreshGame}
            >
              <RefreshCcw color='red' />
            </Button>
          </>
        )
      }
      <GameStatusButton match={match} game={game} />
      <GameEditButton match={match} game={game} />
      <GameCancelButton match={match} game={game} />
    </div>
  )
}

const GameCancelButton = ({ game }: { match: Match & { games: Game[] }; game: Game }) => {
  const notOngoing = game.status !== GameStatus.ONGOING
  const router = useRouter()
  const handleClick = async () => {
    const agree = confirm(`Are you sure you want to cancel this game?`)
    if (agree) {
      try {
        await cancelGame(Number(game.id))
        router.refresh()
        toast.success(`Game has been successfully canceled!`)
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
        text="Only Ongoing games can be canceled"
        hidden={!notOngoing}
      >
        <Button variant='ghost' onClick={handleClick} disabled={notOngoing}>
          <XOctagon color="black" />
        </Button>
      </WithTooltip>
    </WithTooltip>
  )
}

const GameStatusButton = ({ game, match }: { match: Match & { games: Game[] }; game: Game }) => {
  const { id, status } = game
  const finishGameModal = useFinishGameModal()
  const handleEnterResultClick = () => {
    finishGameModal.setGame(game)
    finishGameModal.open()
  }
  const cannotStart = match.status === MatchStatus.UPCOMING ||
    match.games.some(g => g.id !== id && g.status === GameStatus.ONGOING)
  const router = useRouter()
  const handleUpdateGameStatus = async (status: GameStatus) => {
    const agree = confirm(
      `Are you sure you want to change game status to ${status}?`,
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

  const getStartError = () => {
    if (match.status === MatchStatus.UPCOMING) {
      return 'Cannot start game if match is Upcoming'
    }

    return 'Cannot start game while another game is Ongoing'
  }

  if (status === GameStatus.UPCOMING) {
    return (
      <WithTooltip
        text={getStartError()}
        hidden={!cannotStart}
      >
        <Button
          variant='ghost'
          onClick={() => handleUpdateGameStatus(GameStatus.ONGOING)}
          disabled={cannotStart}
        >
          <Play color='green' />
        </Button>
      </WithTooltip>
    )
  }

  if (status === MatchStatus.ONGOING) {
    return (
      <Button variant='ghost' onClick={handleEnterResultClick}>
        <CheckSquare color='green' />
      </Button>
    )
  }

  return null
}

const GameEditButton = ({ game, match }: { match: Match; game: Game }) => {
  const { id, status } = game
  const updateGameModal = useUpdateGameModal()
  const handleUpdateClick = () => {
    updateGameModal.setGame(game)
    updateGameModal.open()
  }
  const cannotUpdate = status !== MatchStatus.UPCOMING

  if (status === GameStatus.UPCOMING) {
    return (
      <WithTooltip
        text='Cannot edit game'
        hidden={!cannotUpdate}
      >
        <Button
          variant='ghost'
          onClick={handleUpdateClick}
          disabled={cannotUpdate}
        >
          <Pencil color='blue' />
        </Button>
      </WithTooltip>
    )
  }

  return null
}

export default GameActions
