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
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Game, Tournament } from '@prisma/client'
import { tournamentFormSchema } from '@/lib/schemas/tournament'
import { getAxiosErrorMessage } from '@/lib/utils'
import { DateTimePicker } from '@/components/ui/date-time-picker'

interface TournamentFormProps {
  initialData?: Tournament | null
  tournamentId?: Tournament['id']
  games: Game[]
}

type TournamentFormValues = z.infer<typeof tournamentFormSchema>

export function TournamentForm({
  initialData,
  tournamentId,
  games,
}: TournamentFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toastMessage = initialData
    ? 'Tournament updated!'
    : 'Tournament created!'
  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: initialData || {
      name: 'UFC 4 Tournament',
      gameId: games[0]?.id,
    },
  })
  const onSubmit = async (values: TournamentFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.put(`/api/tournaments/${tournamentId}`, values)
        await axios('/api/hello')
      } else {
        await axios.post(`/api/tournaments`, values)
      }
      // router.refresh()
      // router.push(`/`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tournament name" {...field} />
              </FormControl>
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
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game</FormLabel>
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
                  {games.map(({ id, name }) => (
                    <SelectItem key={id} value={String(id)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
