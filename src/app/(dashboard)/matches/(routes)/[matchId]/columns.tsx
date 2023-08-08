'use client'
import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/lib/date-utils'
import MatchBadge from '@/app/(dashboard)/tournaments/components/match-badge'
// import GameActions from '@/app/(dashboard)/matches/(routes)/[matchId]]/actions'
import { Match } from '@prisma/client'
import GameStatusBadge from '@/app/(dashboard)/matches/components/game-badge'
import GameActions from '@/app/(dashboard)/matches/components/game-actions'

export const getGameColumns = (match: Match): ColumnDef<any>[] => [
  {
    accessorKey: 'competitors',
    header: '',
    cell: ({ row: { index } }) => (
      <div className="flex flex-row gap-2 items-center">
        <span className="font-semibold">Game {index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: 'startedAt',
    header: 'Start',
    cell: ({
      row: {
        original: { startedAt },
      },
    }) => startedAt && formatDateTime(startedAt),
  },
  {
    accessorKey: 'endedAt',
    header: 'End',
    cell: ({
      row: {
        original: { endedAt },
      },
    }) => endedAt && formatDateTime(endedAt),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <GameStatusBadge status={row.original.status} />
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <GameActions match={match} game={row.original} />
    ),
  },
]
