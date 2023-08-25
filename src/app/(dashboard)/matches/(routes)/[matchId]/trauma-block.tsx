import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TraumaBlockProps {
  subject: string
}

const TraumaBlock = ({ subject }: TraumaBlockProps) => (
  <div className='flex flex-row mb-1'>
    <div className='flex flex-row gap-1 items-center'>
      <Button
        variant='ghost'
        className='px-1 py-0'
        onClick={() => { console.log('editing stat') }}
      >
        <Plus color='red' />
      </Button>
      <div>{subject}</div>
    </div>
  </div>
)

export default TraumaBlock