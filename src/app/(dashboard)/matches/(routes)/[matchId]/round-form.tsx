import { Plus, SeparatorVertical } from 'lucide-react'
import TraumaBlock from '@/app/(dashboard)/matches/(routes)/[matchId]/trauma-block'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { competitorSchema } from '@/lib/schema'
import { Fragment, useCallback, useState } from 'react'
import StaminaForm from '@/app/(dashboard)/matches/(routes)/[matchId]/stamina-form'
import { ufcDamageAreas } from '@/lib/ufc/live-results'

interface RoundFormProps {
  round: number
  competitors: Array<{
    label: string
    value: string
  }>
  initialData?: any
  updateLiveStat: (
    round: number,
    subject: string,
    type: string,
    competitorId: number
  ) => void
}

const RoundForm = ({ round, competitors, updateLiveStat }: RoundFormProps) => {
  const handleStatChange = (
    subject: string,
    type: string,
    competitorId: number
  ) => {
    updateLiveStat(round, subject, type, competitorId)
  }

  const areas = Object.entries(ufcDamageAreas)
  return (
    <div className="flex flex-row gap-1.5">
      {competitors.map((competitor, i) => (
        <Fragment key={`${competitor.value}_block`}>
          <div className="w-1/2 px-2" key={competitor.value}>
            <h3 className="text-center mb-3 font-semibold">
              {competitor.label}
            </h3>
            <div className="flex flex-row justify-between mb-1">
              <div className="flex flex-col">
                <h4 className="mb-1">Traumas</h4>
                {areas.map((area) => {
                  const [subject, label] = area
                  return (
                    <TraumaBlock
                      key={`${subject}_trauma`}
                      subject={subject}
                      label={label}
                      type="traumas"
                      competitorId={Number(competitor.value)}
                      onClick={handleStatChange}
                    />
                  )
                })}
              </div>

              <div className="flex flex-col">
                <h4 className="mb-1">Knockdowns</h4>
                {areas.map((area) => {
                  const [subject, label] = area
                  return (
                    <TraumaBlock
                      key={`${subject}_knockdown`}
                      subject={subject}
                      label={label}
                      type="knockdowns"
                      competitorId={Number(competitor.value)}
                      onClick={handleStatChange}
                    />
                  )
                })}
              </div>
            </div>
            <h3 className="mb-1.5">Stamina</h3>
            <StaminaForm competitor={competitor} />
          </div>
          <div>{i === 0 && <Separator orientation="vertical" />}</div>
        </Fragment>
      ))}
    </div>
  )
}

export default RoundForm
