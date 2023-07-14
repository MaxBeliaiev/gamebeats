'use client'
import { Button } from '@/components/ui/button'

interface StatusButtonsProps {
  tournament: any
}

const StatusButtons = ({ tournament }: StatusButtonsProps) => {
  const { status } = tournament
  return (
    <div className='flex gap-1'>
      {
        status !== 'UPCOMING' && ( <Button variant='info'>Set Upcoming</Button> )
      }
      {
        status !== 'ONGOING' && ( <Button variant='success'>Set Ongoing</Button> )
      }
      {
        status !== 'FINISHED' && ( <Button variant='destructive'>Finish</Button> )
      }
    </div>
  )
}

export default StatusButtons
