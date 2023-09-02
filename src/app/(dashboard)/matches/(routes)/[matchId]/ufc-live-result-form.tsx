'use client'
import { toast } from 'react-hot-toast'
import * as z from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game, UfcEndMethods } from '@prisma/client'
import { getAxiosErrorMessage } from '@/lib/utils'
import { gameFinishFormSchema } from '@/lib/schemas/game'
import * as React from 'react'
import { UFC_ROUNDS } from '@/lib/constants/results'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import RoundForm from '@/app/(dashboard)/matches/(routes)/[matchId]/round-form'
import {
  damageStat,
  getDefaultUfcLiveResults,
  subjectStat,
  UfcLiveStatistics,
} from '@/lib/ufc/live-results'
import { ca } from 'date-fns/locale'
import axios from 'axios'
import { updateLiveStatistics } from '@/lib/actions/ufc'
import useStore from '@/lib/store'

interface UfcLiveResultFormProps {
  game: Game
  competitors: Array<{
    label: string
    value: string
  }>
  onSuccess?: () => void
}

export function UfcLiveResultForm({
  game: { liveStatistics, id: gameId },
  competitors = [],
  onSuccess,
}: UfcLiveResultFormProps) {
  const { setLoading } = useStore((state) => ({
    setLoading: state.ufc.liveResultsForm.setIsLoading,
  }))
  const [liveData, setLiveData] = useState<UfcLiveStatistics>(
    liveStatistics
      ? (liveStatistics as UfcLiveStatistics)
      : getDefaultUfcLiveResults(competitors)
  )
  const router = useRouter()

  const updateAreaStat = async (
    round: number,
    subject: subjectStat,
    type: damageStat,
    competitorId: number
  ) => {
    const competitorIdKey = String(competitorId)
    liveData.rounds[String(round)][competitorIdKey][type][subject] =
      liveData.rounds[String(round)][competitorIdKey][type][subject] + 1
    const newData = { ...liveData }
    await updateLiveResultRequest(newData)
  }

  const updateLiveResultRequest = async (data: UfcLiveStatistics) => {
    try {
      setLoading(true)
      const resp: UfcLiveStatistics = await updateLiveStatistics(data, gameId)
      setLiveData(resp)
      router.refresh()
      toast.success(`Stat updated!`)
    } catch (e: any) {
      toast.error(getAxiosErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const updateStamina = async ({
    round,
    competitorId,
    value,
  }: {
    round: number
    competitorId: number
    value: number
  }) => {
    const competitorIdKey = String(competitorId)
    liveData.rounds[String(round)][competitorIdKey].stamina = value

    await updateLiveResultRequest(liveData)
  }

  const finishRound = async (currentRound: number) => {
    const agree = confirm(
      `Are you sure you want to finish round ${
        currentRound - 1
      }? This action CANNOT be reverted!`
    )

    if (agree) {
      try {
        setLoading(true)
        const resp: UfcLiveStatistics = await updateLiveStatistics(
          {
            ...liveData,
            currentRound,
          },
          gameId
        )

        setLiveData(resp)
        router.refresh()
        toast.success(`Round ${currentRound} started!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Tabs defaultValue="r1">
      <TabsList className="mb-3.5">
        {UFC_ROUNDS.map((r) => (
          <TabsTrigger
            disabled={liveData.currentRound > r}
            onClick={() => r > 1 && finishRound(r)}
            value={`r${r}`}
            key={`round_${r}`}
          >
            Round {r}
          </TabsTrigger>
        ))}
      </TabsList>
      {UFC_ROUNDS.map((r) => (
        <TabsContent value={`r${r}`} key={`round_${r}`}>
          <RoundForm
            round={r}
            competitors={competitors}
            updateLiveStat={updateAreaStat}
            updateStamina={updateStamina}
            key={`round_${r}_form`}
            currentLiveData={liveData}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
