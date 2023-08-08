import { Badge as UIBadge } from '@/components/ui/badge'
import { MatchStatus } from '@prisma/client'

interface MatchBadgeProps {
  status: MatchStatus
}

const MatchBadge = ({ status }: MatchBadgeProps) => {
  const statusVariant: any = {
    [MatchStatus.UPCOMING]: 'info',
    [MatchStatus.ONGOING]: 'success',
    [MatchStatus.FINISHED]: 'destructive',
  }

  return <UIBadge variant={statusVariant[status]}>{status.toLowerCase()}</UIBadge>
}

export default MatchBadge
