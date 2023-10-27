import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowBigLeft,
  ArrowBigRight,
} from 'lucide-react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  onPageChange?: (page: number) => void
  onPreviousPageClick?: () => void
  onNextPageClick?: () => void
}

export function DataTablePagination<TData>(
  {
    table,
    onPageChange,
    onPreviousPageClick,
    onNextPageClick,
  }: DataTablePaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination

  const renderPages = () => {
    const pages = []
    for (let i = 1; i <= Math.round(table.getPageCount()); i++) {
      pages.push(
        <Button
          variant='ghost'
          className='px-2'
          disabled={pageIndex + 1 === i}
          onClick={() => {
            table.setPageIndex(i - 1)
            onPageChange && onPageChange(i)
          }}>
            {i}
        </Button>
      )
    }

    return (
      <>
        {pages}
      </>
    )
  }

  return (
    <div className='flex items-center space-x-6 lg:space-x-8'>
      {/*<div className="flex items-center space-x-2">*/}
      {/*<p className="text-sm font-medium">Rows per page</p>*/}
      {/*<Select*/}
      {/*  value={`${table.getState().pagination.pageSize}`}*/}
      {/*  onValueChange={(value) => {*/}
      {/*    table.setPageSize(Number(value))*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <SelectTrigger className="h-8 w-[70px]">*/}
      {/*    <SelectValue placeholder={table.getState().pagination.pageSize} />*/}
      {/*  </SelectTrigger>*/}
      {/*  <SelectContent side="top">*/}
      {/*    {[10, 20, 30, 40, 50].map((pageSize) => (*/}
      {/*      <SelectItem key={pageSize} value={`${pageSize}`}>*/}
      {/*        {pageSize}*/}
      {/*      </SelectItem>*/}
      {/*    ))}*/}
      {/*  </SelectContent>*/}
      {/*</Select>*/}
      {/*</div>*/}
      <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
        Page {pageIndex + 1} of{' '}
        {Math.round(table.getPageCount())}
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => {
            table.setPageIndex(0)
            onPageChange && onPageChange(1)
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className='sr-only'>Go to first page</span>
          <ArrowBigLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => {
            table.previousPage()
            onPreviousPageClick && onPreviousPageClick()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => {
            table.nextPage()
            onNextPageClick && onNextPageClick()
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
        {
          renderPages()
        }
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => {
            table.setPageIndex(table.getPageCount() - 1)
            onPageChange && onPageChange(Math.round(table.getPageCount()))
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className='sr-only'>Go to last page</span>
          <ArrowBigRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
