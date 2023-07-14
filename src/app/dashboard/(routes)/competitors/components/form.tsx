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
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Competitor } from '@prisma/client'
import { competitorSchema } from '@/lib/schema'

interface CompetitorFormProps {
  initialData?: Competitor | null
  competitorId?: Competitor["id"]
}

type CompetitorFormValues = z.infer<typeof competitorSchema>

export function CompetitorForm({
  initialData,
  competitorId,
}: CompetitorFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toastMessage = initialData
    ? 'Competitor updated!'
    : 'Competitor created!'
  const form = useForm<CompetitorFormValues>({
    resolver: zodResolver(competitorSchema),
    defaultValues: initialData || {
      name: '',
      nickname: '',
      surname: '',
      country: '',
    },
  })
  const onSubmit = async (values: CompetitorFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.put(`/api/competitors/${competitorId}`, values)
      } else {
        await axios.post(`/api/competitors`, values)
      }
      router.refresh()
      router.push(`/dashboard/competitors`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Enter competitor nickname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter competitor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input placeholder="Enter competitor surname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='success' disabled={loading} type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}
