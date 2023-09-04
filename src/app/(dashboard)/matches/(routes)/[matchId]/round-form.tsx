import CrashBlock from '@/app/(dashboard)/matches/(routes)/[matchId]/crash-block'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { competitorSchema } from '@/lib/schema'
import { Fragment } from 'react'
import StaminaForm from '@/app/(dashboard)/matches/(routes)/[matchId]/stamina-form'
import {
  damageStat,
  stat,
  subjectStat,
  ufcDamageAreas,
  UfcLiveStatistics,
} from '@/lib/ufc/live-results'
import useStore from '@/lib/store'

interface RoundFormProps {
  round: number
  competitors: Array<{
    label: string
    value: string
  }>
  initialData?: any
  updateLiveStat: (
    round: number,
    subject: subjectStat,
    type: damageStat,
    competitorId: number
  ) => void
  updateStat: (round: number, type: stat, competitorId: number) => void
  updateStamina: ({
    round,
    competitorId,
    value,
  }: {
    round: number
    competitorId: number
    value: number
  }) => void
  currentLiveData?: UfcLiveStatistics
}

const RoundForm = ({
  round,
  competitors,
  updateLiveStat,
  updateStamina,
  currentLiveData,
  updateStat,
}: RoundFormProps) => {
  const handleStatChange = (
    subject: subjectStat,
    type: damageStat,
    competitorId: number
  ) => {
    updateLiveStat(round, subject, type, competitorId)
  }

  const handleStaminaChange = ({
    value,
    competitorId,
  }: {
    value: number
    competitorId: number
  }) => {
    updateStamina({ round, competitorId, value })
  }

  const { loading } = useStore((state) => ({
    loading: state.ufc.liveResultsForm.isLoading,
  }))
  const areas = Object.entries(ufcDamageAreas) as Array<[subjectStat, string]>
  return (
    <div className="flex flex-row gap-1.5">
      {competitors.map((competitor, i) => (
        <Fragment key={`${competitor.value}_block`}>
          <div className="px-2" key={competitor.value}>
            <h3 className="mb-3 font-semibold">
              {competitor.label}
            </h3>
            <div className="flex flex-row justify-between mb-1">
              <div className="flex flex-col w-full">
                {areas.map((area) => {
                  const [subject, label] = area
                  return (
                    <CrashBlock
                      key={`${subject}_crash`}
                      subject={subject}
                      label={label}
                      type="crashes"
                      competitorId={Number(competitor.value)}
                      onClick={handleStatChange}
                      currentValue={
                        currentLiveData?.competitors[competitor.value].rounds[
                          round
                        ].crashes[subject] || 0
                      }
                    />
                  )
                })}
                <div className="flex flex-row mb-1 w-3/4 justify-between items-center">
                  <Button
                    disabled={loading}
                    onClick={() => {
                      updateStat(round, 'knockdowns', Number(competitor.value))
                    }}
                  >
                    Knockdown
                  </Button>
                  <span>
                    {currentLiveData?.competitors[competitor.value].rounds[
                      round
                    ].knockdowns || 0}
                  </span>
                </div>
              </div>
            </div>
            <h3 className="mb-1.5">Stamina</h3>
            <StaminaForm
              initialData={
                currentLiveData && {
                  stamina:
                    currentLiveData.competitors[String(competitor.value)]
                      .stamina,
                }
              }
              competitor={competitor}
              onSubmit={handleStaminaChange}
            />
          </div>
          <div>{i === 0 && <Separator orientation="vertical" />}</div>
        </Fragment>
      ))}
    </div>
  )
}

export default RoundForm
