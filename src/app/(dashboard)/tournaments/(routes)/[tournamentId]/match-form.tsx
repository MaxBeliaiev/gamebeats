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
import { Match, MatchesOnCompetitors } from '@prisma/client'
import { matchFormSchema } from '@/lib/schemas/match'
import Combobox from '@/components/ui/combobox'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { getAxiosErrorMessage } from '@/lib/utils'

interface MatchFormProps {
  initialData?: Match & {
    competitors: Array<MatchesOnCompetitors>
  }
  tournamentId?: number
  competitors: Array<{
    label: string
    value: string
  }>
  onSuccess?: () => void
}

type MatchFormValues = z.infer<typeof matchFormSchema>

export function MatchForm({
  initialData,
  competitors,
  tournamentId,
  onSuccess,
}: MatchFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toastMessage = initialData ? 'Match updated!' : 'Match created!'
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          competitorOne: String(initialData.competitors[0]?.competitorId),
          competitorTwo: String(initialData.competitors[1]?.competitorId),
        }
      : {},
  })
  const onSubmit = async (values: MatchFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.put(`/api/matches/${initialData.id}`, values)
      } else {
        await axios.post(`/api/matches`, { ...values, tournamentId })
      }
      router.refresh()
      router.push(`/tournaments/${tournamentId}`)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="competitorOne"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Combobox
                title="Select competitor 1"
                value={field.value}
                data={competitors}
                onSelect={(value) => {
                  form.setValue('competitorOne', value)
                }}
                searchText="Search competitor..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="competitorTwo"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Combobox
                title="Select competitor 2"
                value={field.value}
                data={competitors}
                onSelect={(value) => {
                  form.setValue('competitorTwo', value)
                }}
                searchText="Search competitor..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start time</FormLabel>
              <DateTimePicker
                date={field.value}
                setDate={(date) => {
                  form.setValue('startedAt', date)
                }}
              />
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
