'use client'
import { toast } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game, UfcEndMethods } from '@prisma/client'
import Combobox from '@/components/ui/combobox'
import { getAxiosErrorMessage } from '@/lib/utils'
import { gameFinishFormSchema } from '@/lib/schemas/game'
import { Trash } from 'lucide-react'
import * as React from 'react'
import { finishUfcGame } from '@/lib/actions/game'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UFC_ROUNDS } from '@/lib/constants/results'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import RoundForm from "@/app/(dashboard)/matches/(routes)/[matchId]/round-form";

interface FinishGameFormProps {
  initialData: Game
  competitors: Array<{
    label: string
    value: string
  }>
  onSuccess?: () => void
}

type UfcLiveResultFormValues = z.infer<typeof gameFinishFormSchema>

export function UfcLiveResultForm({
  initialData,
  competitors = [],
  onSuccess,
}: FinishGameFormProps) {
  const [loading, setLoading] = useState(false)
  const [showResultDetails, setShowResultDetails] = useState(false)
  const router = useRouter()
  const form = useForm<UfcLiveResultFormValues>({
    resolver: zodResolver(gameFinishFormSchema),
    defaultValues: {
      ...initialData,
      winnerId: initialData.winnerId ? String(initialData.winnerId) : '',
      round: 3,
      endTime: '5:00',
      endMethod: UfcEndMethods.DEC,
    },
  })
  const onSubmit = async (values: UfcLiveResultFormValues) => {
    const agree = confirm(
      `Are you sure you want to finish this game? This action CANNOT be reverted!`
    )
    if (agree) {
      try {
        const { winnerId, round, endTime, endMethod } = values
        setLoading(true)
        let resultData = {
          round,
          endTime,
          endMethod: endMethod as UfcEndMethods,
        }

        await finishUfcGame({
          game: initialData,
          winnerId: Number(winnerId) || null,
          resultData: winnerId
            ? resultData
            : {
                round: 3,
                endMethod: UfcEndMethods.DEC,
                endTime: '5:00',
              },
        })
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
      <Tabs defaultValue="r1">
        <TabsList className='mb-3.5'>
          <TabsTrigger value="r1">Round 1</TabsTrigger>
          <TabsTrigger value="r2">Round 2</TabsTrigger>
          <TabsTrigger value="r3">Round 3</TabsTrigger>
        </TabsList>
        <TabsContent value="r1"><RoundForm round={1} competitors={competitors} /></TabsContent>
        <TabsContent value="r2"><RoundForm round={2} competitors={competitors} /></TabsContent>
        <TabsContent value="r3"><RoundForm round={3} competitors={competitors} /></TabsContent>
      </Tabs>
  )
}
