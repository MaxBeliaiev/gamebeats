import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ufcStaminaUpdateSchema } from '@/lib/schemas/ufc'

interface StaminaFormProps {
  competitor: any
  initialData?: { stamina: number }
  onSubmit: (data: { competitorId: number; value: number }) => void
}

const StaminaForm = ({
  competitor,
  initialData,
  onSubmit,
}: StaminaFormProps) => {
  const form = useForm<any>({
    resolver: zodResolver(ufcStaminaUpdateSchema),
    defaultValues: initialData || {
      stamina: 100,
    },
  })
  const updateStamina = (values: { stamina: number }) => {
    onSubmit({ value: values.stamina, competitorId: competitor.value })
  }

  return (
    <Form {...form} key={`${competitor.value}_form`}>
      <form
        id={`${competitor.value}_form`}
        onSubmit={form.handleSubmit(updateStamina)}
        className="flex flex-row gap-2 items-center"
        key={`${competitor.value}_form`}
      >
        <FormField
          control={form.control}
          name="stamina"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="number" placeholder="Enter stamina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="success" type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}

export default StaminaForm
