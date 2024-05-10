'use client'
import { Button } from '@/components/ui/button'
import { Game, Match, MatchesOnCompetitors, MatchFormat, MatchStatus } from '@prisma/client'
import WithTooltip from '@/components/ui/with-tooltip'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { getAxiosErrorMessage } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { finishMatch } from '@/lib/actions/match'

interface StatusButtonsProps {
  match: Match & {
    games: Array<Game>
    competitors: Array<MatchesOnCompetitors>
  }
}

const MatchStatusButtons = ({ match }: StatusButtonsProps) => {
  const { competitors, games, status, format } = match
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleUpdateMatch = async (status: string) => {
    const agree = confirm(`Are you sure you want to change tournament status to ${status}?`)
    if (agree) {
      try {
        setLoading(true)

        const [c1, c2] = competitors
        let winnerId = null
        switch (true) {
          case c1.score > c2.score:
            winnerId = c1.competitorId;
            break;
          case c2.score > c1.score:
            winnerId = c2.competitorId;
            break;
        }

        await finishMatch(match, winnerId)
        setLoading(false)
        router.refresh()
        toast.success(
          `Match has been successfully updated!`
        )
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  const cannotFinish = !Boolean(games.length) || games.some(
    (game: Game) =>
      game.status !== MatchStatus.FINISHED && game.status !== MatchStatus.CANCELED
  )

  return (
    <>
      {
        format === MatchFormat.SET && (
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 items-center">
              {status !== MatchStatus.FINISHED && (
                <WithTooltip
                  text="Cannot finish tournament without matches/with unfinished matches in it"
                  hidden={!cannotFinish}
                >
                  <Button
                    variant="destructive"
                    disabled={cannotFinish || loading}
                    onClick={() => handleUpdateMatch(MatchStatus.FINISHED)}
                  >
                    Finish set
                  </Button>
                </WithTooltip>
              )}
            </div>
          </div>
        )
      }
    </>
  )
}

export default MatchStatusButtons
