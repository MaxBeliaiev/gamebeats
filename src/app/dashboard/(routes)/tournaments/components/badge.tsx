import { Badge as UIBadge } from '@/components/ui/badge'
import { TournamentStatus } from '@prisma/client'

interface TournamentBadgeProps {
  status: TournamentStatus
}

const TournamentBadge = ({ status }: TournamentBadgeProps) => {
  const statusVariant: any = {
    UPCOMING: 'info',
    ONGOING: 'success',
    FINISHED: 'destructive',
  }

  return <UIBadge variant={statusVariant[status]}>{status.toLowerCase()}</UIBadge>
}

export default TournamentBadge
