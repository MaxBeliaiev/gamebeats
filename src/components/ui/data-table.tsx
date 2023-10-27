'use client'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Row, Header,
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
import { twMerge } from 'tailwind-merge'

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
  wrapperClassName?: string
  headersConfig?: { [key: string]: {
      className?: string
    } }
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
  headersConfig,
  page,
  pageSize = 30,
  manualPagination = false,
  wrapperClassName,
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

  // @ts-ignore
  return (
    <div>
      <div className="rounded-md border">
        <div className={twMerge('w-full overflow-auto', wrapperClassName)}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: Header<TData, any> & { className?: string }) => {
                    const config = headersConfig ? headersConfig[header.id] : null

                    return (
                      <TableHead key={header.id} className={config?.className}>
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
