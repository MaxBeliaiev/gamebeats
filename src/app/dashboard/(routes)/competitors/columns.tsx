'use client'
import { Pencil } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Competitor } from '@prisma/client'
import Link from 'next/link'
import CompetitorDeleteButton from '@/app/dashboard/(routes)/competitors/components/delete-button'

export const columns: ColumnDef<Competitor>[] = [
  {
    accessorKey: 'nickname',
    header: 'Nickname',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'surname',
    header: 'Surname',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const competitor = row.original

      return (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={{
              pathname: `/dashboard/competitors/update/${competitor.id}`,
            }}
          >
            <Pencil color="blue" />
          </Link>
          <CompetitorDeleteButton competitor={row.original} />
        </div>
      )
    },
  },
]
