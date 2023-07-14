'use client'
import { Trash } from 'lucide-react'

interface DeleteButtonProps {
  onClick: () => void
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <Trash color="red" className="cursor-pointer" onClick={onClick} />
)

export default DeleteButton