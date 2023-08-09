'use client'
import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/lib/date-utils'
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
    header: 'Started',
    cell: ({
      row: {
        original: { startedAt },
      },
    }) => startedAt && formatDateTime(startedAt),
  },
  {
    accessorKey: 'endedAt',
    header: 'Ended',
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
    accessorKey: 'winnerId',
    header: 'Winner',
    cell: ({ row: {
      original: { winnerId }
    } }) => winnerId && <span>{winnerId}</span>
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <GameActions match={match} game={row.original} />
    ),
  },
]
