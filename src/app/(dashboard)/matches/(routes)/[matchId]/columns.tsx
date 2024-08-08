'use client'
import { ColumnDef } from '@tanstack/react-table'
import { formatDateTime } from '@/lib/date-utils'
import { Competitor, GameStatus, Match, UfcResultDetails } from "@prisma/client"
import GameStatusBadge from '@/app/(dashboard)/matches/components/game-badge'
import GameActions from '@/app/(dashboard)/matches/components/game-actions'

export const getGameColumns = (
  match: Match & { competitors: Array<{ competitor: Competitor }>, ufcResultDetails: Array<UfcResultDetails> }
): ColumnDef<any>[] => [
  {
    accessorKey: 'competitors',
    header: '',
    cell: ({ row: { index, original } }) => (
      <div className="flex flex-row gap-2 items-center">
        <span className="font-semibold">Game {index + 1} ({original.id})</span>
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
    cell: ({
      row: {
        original: { winnerId, status },
      },
    }) =>
      status === GameStatus.FINISHED && (
        <span>{`${
          winnerId
            ? match.competitors.find((c) => c.competitor.id === winnerId)
                ?.competitor.nickname
            : 'DRAW'
        }`}</span>
      ),
  },
  {
    id: 'method',
    header: 'Method',
    cell: ({ row }) => {
      const { ufcResultDetails } = row.original
      return ufcResultDetails.length ? `${ufcResultDetails[0].endMethod} (R${ufcResultDetails[0].round} ${ufcResultDetails[0].endTime})` : ''
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <GameActions match={match} game={row.original} />,
  },
]
