'use client'
import axios from 'axios'
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

interface FinishGameFormProps {
  initialData: Game
  competitors: Array<{
    label: string
    value: string
  }>
  onSuccess?: () => void
}

type FinishGameFormValues = z.infer<typeof gameFinishFormSchema>

export function FinishGameForm({
  initialData,
  competitors = [],
  onSuccess,
}: FinishGameFormProps) {
  const [loading, setLoading] = useState(false)
  const [showResultDetails, setShowResultDetails] = useState(false)
  const router = useRouter()
  const form = useForm<FinishGameFormValues>({
    resolver: zodResolver(gameFinishFormSchema),
    defaultValues: {
      ...initialData,
      winnerId: initialData.winnerId ? String(initialData.winnerId) : '',
      round: 3,
      endTime: '3:00',
      endMethod: UfcEndMethods.DEC,
    },
  })
  const onSubmit = async (values: FinishGameFormValues) => {
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
                endTime: '3:00',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="winnerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Winner (leave empty if draw)</FormLabel>
              <div className="flex flex-row">
                <Combobox
                  title="Select a winner"
                  value={field.value}
                  data={competitors}
                  onSelect={(value) => {
                    form.setValue('winnerId', value)
                    setShowResultDetails(true)
                  }}
                  searchText="Search competitor..."
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    form.setValue('winnerId', '')
                    setShowResultDetails(false)
                  }}
                  className="rounded-l-none border-l-0 px-3"
                  type="button"
                >
                  <Trash size={15} />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        {showResultDetails && (
          <>
            <h5>Game result details:</h5>
            <FormField
              control={form.control}
              name="endMethod"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>End method</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select win method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UfcEndMethods).map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="round"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Round</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UFC_ROUNDS).map((round) => (
                        <SelectItem key={round} value={String(round)}>
                          {round}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End time of round</FormLabel>
                  <FormControl>
                    <Input placeholder="End time" {...field} />
                  </FormControl>
                  <FormDescription>
                    Format examples: 0:00, 1:25, 0:30, 2:32, 3:00
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button variant="success" disabled={loading} type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}
