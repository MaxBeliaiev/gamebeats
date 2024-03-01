'use client'
import { toast } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game } from '@prisma/client'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { getAxiosErrorMessage } from '@/lib/utils'
import * as React from 'react'
import { parseISO } from 'date-fns'
import { updateUfcGame } from '@/lib/actions/game'
import { gameFormSchema } from '@/lib/schemas/game'

interface GameFormProps {
  initialData?: Game & {
    startedAt: Date | string
  }
  onSuccess?: () => void
}

type GameFormValues = z.infer<typeof gameFormSchema>

export function GameForm({
                            initialData,
                            onSuccess,
                          }: GameFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toastMessage = 'Game updated!'
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        startedAt: typeof initialData.startedAt === 'string' ? parseISO(initialData.startedAt) : initialData.startedAt,
      }
      : {},
  })
  const onSubmit = async (values: GameFormValues) => {
    console.log(values)
    try {
      setLoading(true)
      if (initialData) {
        await updateUfcGame(initialData.id, values)
      }
      router.refresh()
      toast.success(toastMessage)
      onSuccess && onSuccess()
    } catch (e: any) {
      toast.error(getAxiosErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='startedAt'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Start time</FormLabel>
              <DateTimePicker
                date={field.value}
                setDate={(date) => {
                  // @ts-ignore
                  form.setValue('startedAt', date)
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='success' disabled={loading} type='submit'>
          Save
        </Button>
      </form>
    </Form>
  )
}
