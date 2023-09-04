import { Button } from '@/components/ui/button'
import { damageStat, subjectStat } from '@/lib/ufc/live-results'
import useStore from '@/lib/store'

interface CrashBlockProps {
  subject: subjectStat
  type: damageStat
  onClick: (
    subject: subjectStat,
    type: damageStat,
    competitorId: number
  ) => void
  label: string
  competitorId: number
  currentValue: number
}

const CrashBlock = ({
  subject,
  type,
  onClick,
  label,
  competitorId,
  currentValue,
}: CrashBlockProps) => {
  const { loading } = useStore((state) => ({
    loading: state.ufc.liveResultsForm.isLoading,
  }))
  return (
    <div className="flex flex-row mb-2.5 w-3/4 justify-between items-center">
        <Button
          className='w-[110px]'
          disabled={loading}
          onClick={() => {
            onClick(subject, type, competitorId)
          }}
        >
          {label} crash
        </Button>
        <span>{currentValue}</span>
    </div>
  )
}

export default CrashBlock
