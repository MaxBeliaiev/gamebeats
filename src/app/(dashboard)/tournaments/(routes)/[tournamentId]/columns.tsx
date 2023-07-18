'use client'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { formatDateTime } from '@/lib/date-utils'
import MatchBadge from '@/app/(dashboard)/tournaments/components/match-badge'
import { Pencil, Plus } from 'lucide-react'
import TournamentDeleteButton from '@/app/(dashboard)/tournaments/components/delete-button'
import { Button } from '@/components/ui/button'
import { useCreateMatchModal } from '@/hooks/use-create-match-modal'
import ActionsHeader from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/actions-header'
import MatchActions from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/actions'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'competitors',
    header: '',
    cell: ({ row }) => {
      const {
        competitors: [cOneData, cTwoData],
      } = row.original

      return (
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{cOneData.competitor.nickname}</span>
          <span>vs.</span>
          <span className="font-semibold">{cTwoData.competitor.nickname}</span>
        </div>
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
      return <MatchBadge status={row.original.status} />
    },
  },
  {
    id: 'actions',
    header: () => <ActionsHeader />,
    cell: ({ row }) => <MatchActions match={row.original} />,
  },
]
