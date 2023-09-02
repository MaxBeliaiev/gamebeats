'use client'
import { Pencil } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Tournament, TournamentStatus } from '@prisma/client'
import Link from 'next/link'
import { formatDateTime } from '@/lib/date-utils'
import TournamentBadge from '@/app/(dashboard)/tournaments/components/tournament-badge'
import TournamentDeleteButton from '@/app/(dashboard)/tournaments/components/delete-button'

export const columns: ColumnDef<Tournament>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const { id, name } = row.original
      return (
        <Link
          className="font-semibold hover:underline"
          href={{ pathname: `/tournaments/${id}` }}
          prefetch={false}
        >
          {name}
        </Link>
      )
    },
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
      return <TournamentBadge status={row.original.status} />
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const tournament = row.original

      return (
        <div className="flex items-center justify-end gap-1.5">
          {tournament.status !== TournamentStatus.FINISHED && (
            <Link
              href={{
                pathname: `/tournaments/update/${tournament.id}`,
              }}
            >
              <Pencil color="blue" />
            </Link>
          )}
          <TournamentDeleteButton tournament={tournament} />
        </div>
      )
    },
  },
]
