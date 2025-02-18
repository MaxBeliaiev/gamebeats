'use client'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game } from '@prisma/client'
import { getAxiosErrorMessage } from '@/lib/utils'
import * as React from 'react'
import { UFC_ROUNDS } from '@/lib/constants/results'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import RoundForm from '@/app/(dashboard)/matches/(routes)/[matchId]/round-form'
import {
  damageLevel,
  damageStat,
  getDefaultUfcLiveResults, lungsDamageLevel, stat,
  subjectStat,
  UfcLiveStatistics,
} from '@/lib/ufc/live-results'
import { updateLiveStatistics } from '@/lib/actions/ufc'
import useStore from '@/lib/store'
import axios from "axios"

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
}: UfcLiveResultFormProps) {
  const { setLoading } = useStore((state) => ({
    setLoading: state.ufc.liveResultsForm.setIsLoading,
  }))
  const [liveData, setLiveData] = useState<UfcLiveStatistics>(
    liveStatistics
      ? liveStatistics as UfcLiveStatistics
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
    liveData.competitors[competitorIdKey].rounds[round][type][subject]++
    await updateLiveResultRequest(liveData)
  }

  const updateCutsStat = async (
    round: number,
    value: damageLevel,
    competitorId: number
  ) => {
    const competitorIdKey = String(competitorId)
    liveData.competitors[competitorIdKey].rounds[round].cuts = value
    await updateLiveResultRequest(liveData)
  }

  const updateLungsStat = async (
    round: number,
    value: lungsDamageLevel,
    competitorId: number
  ) => {
    const competitorIdKey = String(competitorId)
    liveData.competitors[competitorIdKey].rounds[round].lungs = value
    await updateLiveResultRequest(liveData)
  }

  const updateSubmissionStat = async (
    round: number,
    subject: damageStat,
    competitorId: number
  ) => {
    const competitorIdKey = String(competitorId)
    liveData.competitors[competitorIdKey].rounds[round].submissions[subject]++
    await updateLiveResultRequest(liveData)
  }

  const updateStat = async (
    round: number,
    type: stat,
    competitorId: number
  ) => {
    const competitorIdKey = String(competitorId)
    liveData.competitors[competitorIdKey].rounds[round][type]++
    await updateLiveResultRequest(liveData)
  }

  const updateLiveResultRequest = async (data: UfcLiveStatistics) => {
    try {
      setLoading(true)
      const resp: UfcLiveStatistics = await updateLiveStatistics(data, gameId)
      setLiveData(resp)
      router.refresh()
      toast.success(`Stat updated!`, { duration: 1000 })

      await axios.post(`https://odds.solutions.eaisy.tech/live/updateLiveMatch/${gameId}`, {
        requestId: 'random_requestId'
      })
    } catch (e: any) {
      toast.error(getAxiosErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const updateStamina = async ({
    competitorId,
    value,
  }: {
    competitorId: number
    value: number
  }) => {
    liveData.competitors[String(competitorId)].stamina = value

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
            onClick={() => (r > 1 && r > liveData.currentRound) && finishRound(r)}
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
            updateSubmissionStat={updateSubmissionStat}
            updateStat={updateStat}
            updateStamina={updateStamina}
            updateCutsStat={updateCutsStat}
            updateLungsStat={updateLungsStat}
            key={`round_${r}_form`}
            currentLiveData={liveData}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
