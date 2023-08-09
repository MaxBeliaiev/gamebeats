'use client'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game } from '@prisma/client'
import Combobox from '@/components/ui/combobox'
import { getAxiosErrorMessage } from '@/lib/utils'
import { gameFinishFormSchema } from '@/lib/schemas/game'
import { Trash } from 'lucide-react'
import * as React from 'react'
import { finishGame } from '@/lib/actions/game'

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
  const router = useRouter()
  const form = useForm<FinishGameFormValues>({
    resolver: zodResolver(gameFinishFormSchema),
    defaultValues: {
      ...initialData,
      winnerId: initialData.winnerId ? String(initialData.winnerId) : '',
    },
  })
  const onSubmit = async (values: FinishGameFormValues) => {
    try {
      console.log(values)
      setLoading(true)
      await finishGame({
        game: initialData,
        data: {
          ...values,
          winnerId: Number(values.winnerId) || null,
        },
      })
      router.refresh()
      // router.push(`/matches/${match.id}`)
      toast.success('Game updated!')
      onSuccess && onSuccess()
    } catch (e: any) {
      toast.error(getAxiosErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  }}
                  searchText="Search competitor..."
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="success" disabled={loading} type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}
