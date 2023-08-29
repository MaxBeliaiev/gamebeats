import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TraumaBlockProps {
  subject: string
  type: string
  onClick: (subject: string, type: string, competitorId: number) => void
  label: string
  competitorId: number
}

const TraumaBlock = ({ subject, type, onClick, label, competitorId }: TraumaBlockProps) => (
  <div className='flex flex-row mb-1'>
    <div className='flex flex-row gap-1 items-center'>
      <Button
        variant='ghost'
        className='px-1 py-0'
        onClick={() => { onClick(subject, type, competitorId) }}
      >
        <Plus color='red' />
      </Button>
      <div>{label}</div>
    </div>
  </div>
)

export default TraumaBlock