import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ufcStaminaUpdateSchema } from '@/lib/schemas/ufc'
import useStore from '@/lib/store'
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

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
  const { loading } = useStore((state) => ({
    loading: state.ufc.liveResultsForm.isLoading,
  }))

  const form = useForm<any>({
    resolver: zodResolver(ufcStaminaUpdateSchema),
    defaultValues: initialData || {
      stamina: 100,
    },
  })
  const formValues = form.getValues()
  const [stamina, setStamina] = useState(formValues.stamina)
  const updateStamina = (values: { stamina: number }) => {
    onSubmit({ value: values.stamina, competitorId: competitor.value })
  }
  return (
    <>
      <h3 className="mb-1.5">Stamina: {stamina}</h3>
      <Form {...form} key={`${competitor.value}_form`}>
        <form
          id={`${competitor.value}_form`}
          onSubmit={form.handleSubmit(updateStamina)}
          className="flex flex-row gap-4 items-center"
          key={`${competitor.value}_form`}
        >
          <FormField
            control={form.control}
            name="stamina"
            render={() => (
              <FormItem>
                <FormControl>
                  <Slider
                    value={[formValues.stamina]}
                    onValueChange={(values) => {
                      const value = values[0]
                      form.setValue('stamina', value)
                      setStamina(value)
                    }}
                    max={100}
                    min={0}
                    step={5}
                    className="min-w-[150px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="success" type="submit" disabled={loading}>
            Save
          </Button>
        </form>
      </Form>
    </>
  )
}

export default StaminaForm
