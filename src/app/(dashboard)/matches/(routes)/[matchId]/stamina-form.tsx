import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { competitorSchema } from '@/lib/schema'
import { useState } from 'react'

interface StaminaFormProps {
  competitor: any
  initialData?: any
}

const StaminaForm = ({ competitor, initialData }: StaminaFormProps) => {
  const form = useForm<any>({
    resolver: zodResolver(competitorSchema),
    defaultValues: initialData || {
      stamina: 100,
    },
  })
  const [loading, setLoading] = useState(false)
  const updateStamina = () => {
    console.log('updating stamina')
  }

  return (
    <Form {...form} key={`${competitor.value}_form`}>
      <form onSubmit={form.handleSubmit(updateStamina)} className='flex flex-row gap-2 items-center'
            key={`${competitor.value}_form`}>
        <FormField
          control={form.control}
          name='stamina'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='number' placeholder='Enter stamina' {...field} />
              </FormControl>
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

export default StaminaForm