import { Badge as UIBadge } from '@/components/ui/badge'
import { GameStatus } from '@prisma/client'

interface MatchBadgeProps {
  status: GameStatus
}

const GameStatusBadge = ({ status }: MatchBadgeProps) => {
  const statusVariant: any = {
    [GameStatus.UPCOMING]: 'info',
    [GameStatus.ONGOING]: 'success',
    [GameStatus.FINISHED]: 'destructive',
  }

  return <UIBadge variant={statusVariant[status]}>{status.toLowerCase()}</UIBadge>
}

export default GameStatusBadge
