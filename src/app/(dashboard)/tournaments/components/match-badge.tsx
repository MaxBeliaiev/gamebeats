import { Badge as UIBadge } from '@/components/ui/badge'
import { MatchStatus } from '@prisma/client'

interface MatchBadgeProps {
  status: MatchStatus
}

const MatchBadge = ({ status }: MatchBadgeProps) => {
  const statusVariant: any = {
    UPCOMING: 'info',
    ONGOING: 'success',
    FINISHED: 'destructive',
  }

  return <UIBadge variant={statusVariant[status]}>{status.toLowerCase()}</UIBadge>
}

export default MatchBadge
