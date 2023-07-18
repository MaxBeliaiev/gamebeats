'use client'
import { Button } from '@/components/ui/button'

interface StatusButtonsProps {
  tournament: any
}

const StatusButtons = ({ tournament }: StatusButtonsProps) => {
  const { status } = tournament
  return (
    <div className='flex gap-3 items-center'>
      <span>Change status: </span>
      <div className='flex gap-1 items-center'>
        {
          status !== 'UPCOMING' && ( <Button variant='info'>Upcoming</Button> )
        }
        {
          status !== 'ONGOING' && ( <Button variant='success'>Ongoing</Button> )
        }
        {
          status !== 'FINISHED' && ( <Button variant='destructive'>Finish</Button> )
        }
      </div>
    </div>
  )
}

export default StatusButtons
