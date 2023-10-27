'use client'
import { Button } from '@/components/ui/button'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Row,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: Row<TData>) => void
  rowClassName?: string
  page?: number
  pageCount?: number
  pageSize?: number
  onPreviousPageClick?: () => void
  onNextPageClick?: () => void
  onPageChange?: (page: number) => void
  manualPagination?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  rowClassName,
  onPreviousPageClick,
  onNextPageClick,
  onPageChange,
  pageCount,
  page,
  pageSize = 30,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex: page ? page - 1 : 0,
        pageSize,
      }
    },
    initialState: {
      pagination: {
        pageSize,
        ...(page && {
          pageIndex: page - 1,
        }),
      },
    },
    ...(pageCount && {
      pageCount
    }),
    manualPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={rowClassName}
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination
          table={table}
          onNextPageClick={onNextPageClick}
          onPreviousPageClick={onPreviousPageClick}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
