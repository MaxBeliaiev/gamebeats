'use client'
import { Button } from '@/components/ui/button'
import { Match, MatchStatus } from '@prisma/client'
import WithTooltip from '@/components/ui/with-tooltip'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { getAxiosErrorMessage } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface StatusButtonsProps {
  tournament: any
}

const TournamentStatusButtons = ({ tournament: { id, name, disciplineId, startedAt, matches, status } }: StatusButtonsProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleUpdateTournament = async (status: string) => {
    const agree = confirm(`Are you sure you want to change tournament status to ${status}?`)
    if (agree) {
      try {
        setLoading(true)
        await axios.put(`/api/tournaments/${id}`, {
          name,
          disciplineId,
          startedAt,
          status,
        })
        setLoading(false)
        router.refresh()
        toast.success(
          `Tournament ${name} has been successfully updated!`
        )
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      }
    }
  }

  const cannotFinish = !Boolean(matches.length) || matches.some(
    (match: Match) =>
      match.status !== MatchStatus.FINISHED && match.status !== MatchStatus.CANCELED
  )

  const hasNotOnlyUpcomingMatches = matches.some(
    (match: Match) => match.status !== MatchStatus.UPCOMING
  )

  return (
    <div className="flex gap-3 items-center">
      <span>Change status: </span>
      <div className="flex gap-1 items-center">
        {status !== 'UPCOMING' && (
          <WithTooltip
            text="Cannot make tournament Upcoming with ongoing/finished matches in it"
            hidden={!hasNotOnlyUpcomingMatches}
          >
            <Button
              variant="info"
              disabled={hasNotOnlyUpcomingMatches || loading}
              onClick={() => handleUpdateTournament(MatchStatus.UPCOMING)}
            >
              Upcoming
            </Button>
          </WithTooltip>
        )}
        {status !== 'ONGOING' && (
          <Button
            variant="success"
            disabled={loading}
            onClick={() => handleUpdateTournament(MatchStatus.ONGOING)}
          >
            Ongoing
          </Button>
        )}
        {status !== 'FINISHED' && (
          <WithTooltip
            text="Cannot finish tournament without matches/with unfinished matches in it"
            hidden={!cannotFinish}
          >
            <Button
              variant="destructive"
              disabled={cannotFinish || loading}
              onClick={() => handleUpdateTournament(MatchStatus.FINISHED)}
            >
              Finish
            </Button>
          </WithTooltip>
        )}
      </div>
    </div>
  )
}

export default TournamentStatusButtons
