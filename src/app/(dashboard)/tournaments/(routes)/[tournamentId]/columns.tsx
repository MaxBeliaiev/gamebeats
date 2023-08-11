'use client'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { formatDateTime } from '@/lib/date-utils'
import MatchBadge from '@/app/(dashboard)/tournaments/components/match-badge'
import ActionsHeader from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/actions-header'
import MatchActions from '@/app/(dashboard)/tournaments/(routes)/[tournamentId]/actions'
import { Tournament } from '@prisma/client'

export const getMatchColumns = (tournament: Tournament): ColumnDef<any>[] => [
  {
    accessorKey: 'competitors',
    header: '',
    cell: ({ row }) => {
      const {
        id,
        competitors: [cOne, cTwoD],
      } = row.original

      return (
        <div className='flex flex-row gap-2 items-center'>
          <Link className='font-semibold hover:underline' href={{ pathname: `/matches/${id}` }}>
            <span>{cOne.competitor.nickname}</span>
            <span> vs. </span>
            <span>{cTwoD.competitor.nickname}</span>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const {
        id,
        competitors: [cOne, cTwo],
      } = row.original

      return (
        <div className='flex flex-row gap-2 items-center'>
            <span>{cOne.score}</span>
            <span> - </span>
            <span>{cTwo.score}</span>
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
    cell: ({ row }) => (
      <MatchActions tournament={tournament} match={row.original} />
    ),
  },
]
