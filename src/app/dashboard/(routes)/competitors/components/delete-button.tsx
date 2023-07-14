'use client'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Competitor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/ui/delete-button'
const CompetitorDeleteButton = ({
  competitor: { name, id },
}: {
  competitor: Competitor
}) => {
  const router = useRouter()
  const onClick = async () => {
    const agree = confirm(`Are you sure you want to delete ${name}?`)
    if (agree) {
      try {
        await axios.delete(`/api/competitors/${id}`)
        router.refresh()
        toast.success(`${name} has been successfully deleted!`)
      } catch (e: any) {
        toast.error('Something went wrong.')
      }
    }
  }

  return <DeleteButton onClick={onClick} />
}

export default CompetitorDeleteButton
