'use client'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteButtonProps {
  onClick: () => void
  disabled?: boolean
}

const DeleteButton = ({ onClick, disabled = false }: DeleteButtonProps) => (
  <Button variant='ghost' onClick={onClick} disabled={disabled}>
    <Trash color="red" />
  </Button>
)

export default DeleteButton