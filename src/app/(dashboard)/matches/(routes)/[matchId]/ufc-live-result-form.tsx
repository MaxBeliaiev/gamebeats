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
import { getDefaultUfcLiveResults, UfcLiveStatistics } from '@/lib/ufc/live-results'
import { ca } from 'date-fns/locale'

interface UfcLiveResultFormProps {
  game: Game
  competitors: Array<{
    label: string
    value: string
  }>
  onSuccess?: () => void
}

type UfcLiveResultFormValues = z.infer<typeof gameFinishFormSchema>

export function UfcLiveResultForm(
  {
    game: { liveStatistics },
    competitors = [],
    onSuccess,
  }: UfcLiveResultFormProps) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<UfcLiveStatistics>(
    liveStatistics ? liveStatistics as UfcLiveStatistics : getDefaultUfcLiveResults(competitors),
  )
  const router = useRouter()

  const updateLiveStatistics = (data: any) => {
    console.log(data)
  }

  const finishRound = async (currentRound: number) => {
    const agree = confirm(
      `Are you sure you want to finish round ${currentRound - 1}? This action CANNOT be reverted!`,
    )

    if (agree) {
      try {
        const newData = {
          ...results,
          currentRound,
        }

        await updateLiveStatistics(newData)

        setResults(newData)
        router.refresh()
        toast.success(`Round ${currentRound} started!`)
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      } finally {
        setLoading(false)
      }
    }
  }

  const onSubmit = async () => {
    const agree = confirm(
      `Are you sure you want to finish this game? This action CANNOT be reverted!`,
    )
    if (agree) {
      try {
        setLoading(true)

        // await finishUfcGame({
        //   game,
        //   winnerId: Number(winnerId) || null,
        //   resultData: winnerId
        //     ? resultData
        //     : {
        //       round: 3,
        //       endMethod: UfcEndMethods.DEC,
        //       endTime: '5:00',
        //     },
        // })
        router.refresh()
        toast.success('Game updated!')
        onSuccess && onSuccess()
      } catch (e: any) {
        toast.error(getAxiosErrorMessage(e))
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Tabs defaultValue='r1'>
      <TabsList className='mb-3.5'>
        {
          UFC_ROUNDS.map(r => (
            <TabsTrigger
              disabled={results.currentRound > r}
              onClick={() => finishRound(r)}
              value={`r${r}`}
              key={`round_${r}`}>Round {r}
            </TabsTrigger>
          ))
        }
      </TabsList>
      {
        UFC_ROUNDS.map(r => (
          <TabsContent value={`r${r}`} key={`round_${r}`}>
            <RoundForm round={r} competitors={competitors} key={`round_${r}_form`} />
          </TabsContent>
        ))
      }
    </Tabs>
  )
}
