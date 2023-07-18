import * as React from 'react'
import { DateTime } from 'luxon'
import { Calendar as CalendarIcon, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { SelectSingleEventHandler } from 'react-day-picker'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRef, useState } from 'react'
import { useInteractOutside } from 'react-aria'

interface DateTimePickerProps {
  date: Date | null
  setDate: (date: Date | null) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] =
    React.useState<DateTime | null>(date ? DateTime.fromJSDate(date) : null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected || new Date())
    const modifiedDay = selectedDay.set({
      hour: selectedDay.hour,
      minute: selectedDay.minute,
    })

    setSelectedDateTime(modifiedDay)
  }

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target
    const hours = Number.parseInt(value.split(':')[0] || '00', 10)
    const minutes = Number.parseInt(value.split(':')[1] || '00', 10)
    const modifiedDay = selectedDateTime!.set({ hour: hours, minute: minutes })

    setSelectedDateTime(modifiedDay)
  }

  useInteractOutside({
    ref: contentRef,
    onInteractOutside: (e) => {
      selectedDateTime && setDate(selectedDateTime.toJSDate())
      setOpen(false)
    },
  })

  const footer = selectedDateTime ? (
    <div className="px-4 pt-0 pb-4">
      <Label>Time</Label>
      <Input
        type="time"
        onChange={handleTimeChange}
        value={selectedDateTime ? selectedDateTime.toFormat('HH:mm') : ''}
      />
    </div>
  ) : (
    <p className="text-center pb-2">Please select a date!</p>
  )

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <div className="flex items-center">
        <PopoverTrigger asChild className="z-10">
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal rounded-r-none',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              selectedDateTime!.toFormat('DDD HH:mm')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedDateTime(null)
            setDate(null)
          }}
          className="rounded-l-none border-l-0 px-3"
          type="button"
        >
          <Trash size={15} />
        </Button>
      </div>
      <PopoverContent ref={contentRef} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime ? selectedDateTime.toJSDate() : undefined}
          onSelect={handleSelect}
          initialFocus
        />
        {footer}
      </PopoverContent>
    </Popover>
  )
}
