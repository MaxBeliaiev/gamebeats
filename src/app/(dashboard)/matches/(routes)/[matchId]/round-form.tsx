import CrashBlock from '@/app/(dashboard)/matches/(routes)/[matchId]/crash-block'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Fragment } from 'react'
import StaminaForm from '@/app/(dashboard)/matches/(routes)/[matchId]/stamina-form'
import {
  damageLevel,
  damageLevelsData,
  lungsDamageLevelsData,
  damageStat,
  stat,
  subjectStat,
  ufcDamageAreas,
  UfcLiveStatistics,
  lungsDamageLevel,
} from '@/lib/ufc/live-results'
import useStore from '@/lib/store'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
    competitorId: number,
  ) => void
  updateCutsStat: (
    round: number,
    value: damageLevel,
    competitorId: number,
  ) => void
  updateLungsStat: (
    round: number,
    value: lungsDamageLevel,
    competitorId: number,
  ) => void
  updateSubmissionStat: (
    round: number,
    subject: damageStat,
    competitorId: number,
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
  currentLiveData: UfcLiveStatistics
}

const RoundForm = ({
                     round,
                     competitors,
                     updateLiveStat,
                     updateCutsStat,
                     updateLungsStat,
                     updateStamina,
                     currentLiveData,
                     updateStat,
                     updateSubmissionStat,
                   }: RoundFormProps) => {
  const handleStatChange = (
    subject: subjectStat,
    type: damageStat,
    competitorId: number,
  ) => {
    updateLiveStat(round, subject, type, competitorId)
  }

  const handleSubmissionStatChange = (
    subject: damageStat,
    competitorId: number,
  ) => {
    updateSubmissionStat(round, subject, competitorId)
  }

  const handleStaminaChange = ({ value, competitorId }: {
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
    <div className='flex flex-row gap-1.5 justify-between'>
      {competitors.map((competitor, i) => {
        const competitorId = Number(competitor.value)
        const { knockdowns, cuts, lungs, submissions, crashes } =
          currentLiveData.competitors[competitor.value].rounds[round]
        return (
          <div className='flex flex-col' key={`${competitor.value}_block`}>
            <div className='px-2 w-60' key={competitor.value}>
              <h3 className='mb-3 font-semibold'>
                {competitor.label}
              </h3>
              <div className='flex flex-row justify-between mb-1'>
                <div className='flex flex-col w-full'>
                  {areas.map((area) => {
                    const [subject, label] = area
                    return (
                      <CrashBlock
                        key={`${subject}_crash`}
                        subject={subject}
                        label={label}
                        type='crashes'
                        competitorId={competitorId}
                        onClick={handleStatChange}
                        currentValue={crashes[subject] || 0}
                      />
                    )
                  })}
                  <div className='flex flex-row mb-2.5 w-3/4 justify-between items-center'>
                    <Button
                      className='w-[110px]'
                      disabled={loading}
                      onClick={() => {
                        handleSubmissionStatChange('crashes', competitorId)
                      }}
                    >
                      Sub. crash
                    </Button>
                    <span>{submissions.crashes || 0}</span>
                  </div>
                  <div className='flex flex-row mb-2.5 w-3/4 justify-between items-center'>
                    <Button
                      disabled={loading}
                      className='w-[110px]'
                      onClick={() => {
                        updateStat(round, 'knockdowns', competitorId)
                      }}
                    >
                      Knockdown
                    </Button>
                    <span>
                    {knockdowns || 0}
                  </span>
                  </div>
                  <div className='flex flex-row mb-2.5 w-3/4 justify-between items-baseline'>
                    <h3 className='mb-0 mr-2'>
                      Cuts:
                    </h3>
                    <RadioGroup
                      value={cuts}
                      defaultValue={cuts || 'none'}
                      onValueChange={(value: damageLevel) => updateCutsStat(round, value, competitorId)}
                      className='flex flex-row'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='none' id='cuts_none' />
                        <Label htmlFor='cuts_none'>0%</Label>
                      </div>
                      {
                        damageLevelsData.map(({ level, label, color}) => {
                          const id = `cuts_${level}`

                          return (
                          <div className='flex items-center space-x-2' key={`cuts_${level}`}>
                            <RadioGroupItem value={level} id={id} />
                            <Label htmlFor={id} style={{color: `rgb(${color})`}}>{label}</Label>
                          </div>
                        )}
                        )
                      }
                    </RadioGroup>
                  </div>
                  <div className='flex flex-row mb-2.5 w-3/4 justify-between items-baseline'>
                    <h3 className='mb-0 mr-2'>
                      Lungs:
                    </h3>
                    <RadioGroup
                      value={lungs}
                      defaultValue={lungs || 'none'}
                      onValueChange={(value: lungsDamageLevel) => updateLungsStat(round, value, competitorId)}
                      className='flex flex-row'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='none' id='lungs_none' />
                        <Label htmlFor='lungs_none'>0%</Label>
                      </div>
                      {
                        lungsDamageLevelsData.map(({ level, label, color}) => {
                          const id = `lungs_${level}`

                          return (
                            <div className='flex items-center space-x-2' key={`lungs_${level}`}>
                              <RadioGroupItem value={level} id={id} />
                              <Label htmlFor={id} style={{color: `rgb(${color})`}}>{label}</Label>
                            </div>
                          )}
                        )
                      }
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
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
            <div>{i === 0 && <Separator orientation='vertical' />}</div>
          </div>
        )
      })}
    </div>
  )
}

export default RoundForm
