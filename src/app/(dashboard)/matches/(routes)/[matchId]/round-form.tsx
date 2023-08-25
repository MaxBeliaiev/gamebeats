import { Plus, SeparatorVertical } from 'lucide-react'
import TraumaBlock from '@/app/(dashboard)/matches/(routes)/[matchId]/trauma-block'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { competitorSchema } from '@/lib/schema'
import { Fragment, useState } from 'react'
import StaminaForm from '@/app/(dashboard)/matches/(routes)/[matchId]/stamina-form'

interface RoundFormProps {
  round: number
  competitors: Array<{
    label: string
    value: string
  }>
  initialData?: any
}

const RoundForm = ({ round, competitors, initialData }: RoundFormProps) => {
  return (
    <div className='flex flex-row gap-1.5'>
      {
        competitors.map((competitor, i) => (
          <Fragment key={`${competitor.value}_block`}>
            <div className='w-1/2 px-2' key={competitor.value}>
              <h3 className='text-center mb-3 font-semibold'>{competitor.label}</h3>
              <div className='flex flex-row justify-between mb-1'>
                <div className='flex flex-col'>
                  <h4 className='mb-1'>Traumas</h4>
                  <TraumaBlock key='head_trauma' subject='Head' />
                  <TraumaBlock key='body_trauma' subject='Body' />
                  <TraumaBlock key='r_leg_trauma' subject='R. Leg' />
                  <TraumaBlock key='l_leg_trauma' subject='L. Leg' />
                </div>

                <div className='flex flex-col'>
                  <h4 className='mb-1'>Knockdowns</h4>
                  <TraumaBlock key='head_knockdowns' subject='Head' />
                  <TraumaBlock key='body_knockdowns' subject='Body' />
                  <TraumaBlock key='r_leg_knockdowns' subject='R. Leg' />
                  <TraumaBlock key='l_leg_knockdowns' subject='L. Leg' />
                </div>
              </div>
              <h3 className='mb-1.5'>Stamina</h3>
              <StaminaForm competitor={competitor} />
            </div>
            <div>
              {
                i === 0 &&
                <Separator orientation='vertical' />
              }
            </div>
          </Fragment>
        ))
      }
    </div>
  )
}

export default RoundForm