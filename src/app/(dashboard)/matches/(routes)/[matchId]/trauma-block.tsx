import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { damageStat, subjectStat } from '@/lib/ufc/live-results'
import useStore from '@/lib/store'

interface TraumaBlockProps {
  subject: subjectStat
  type: damageStat
  onClick: (
    subject: subjectStat,
    type: damageStat,
    competitorId: number
  ) => void
  label: string
  competitorId: number
}

const TraumaBlock = ({
  subject,
  type,
  onClick,
  label,
  competitorId,
}: TraumaBlockProps) => {
  const { loading } = useStore((state) => ({
    loading: state.ufc.liveResultsForm.isLoading,
  }))
  return (
    <div className="flex flex-row mb-1">
      <div className="flex flex-row gap-1 items-center">
        <Button
          disabled={loading}
          variant="ghost"
          className="px-1 py-0"
          onClick={() => {
            onClick(subject, type, competitorId)
          }}
        >
          <Plus color="red" />
        </Button>
        <div>{label}</div>
      </div>
    </div>
  )
}

export default TraumaBlock
