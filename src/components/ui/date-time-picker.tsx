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
import { addDays } from 'date-fns'

interface DateTimePickerProps {
  date?: Date
  setDate: (date?: Date | null) => void
  disablePastDays?: boolean
}

export function DateTimePicker({
  date,
  setDate,
  disablePastDays = true,
}: DateTimePickerProps) {
  const timeRef = useRef<HTMLInputElement | null>(null)
  const selectedDateTime = date ? DateTime.fromJSDate(date || new Date()) : null
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected || new Date())
    const modifiedDay = selectedDay.set({
      hour: selectedDay.hour,
      minute: selectedDay.minute,
    })

    setDate(modifiedDay.toJSDate())
    if (timeRef.current) {
      timeRef.current.value = modifiedDay.toFormat('HH:mm')
    }
  }

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target
    const hours = Number.parseInt(value.split(':')[0] || '00', 10)
    const minutes = Number.parseInt(value.split(':')[1] || '00', 10)
    const modifiedDay = selectedDateTime!.set({ hour: hours, minute: minutes })

    setDate(modifiedDay.toJSDate())
  }

  useInteractOutside({
    ref: contentRef,
    onInteractOutside: (e) => {
      selectedDateTime && setDate(selectedDateTime.toJSDate())
      setOpen(false)
    },
  })

  const footer = selectedDateTime ? (
    <div className="px-4 pt-0 pb-2 flex-row flex items-center gap-2 h-11">
      <Label>Time:</Label>
      <Input
        type="time"
        onBlur={handleTimeChange}
        ref={timeRef}
        defaultValue={selectedDateTime ? selectedDateTime.toFormat('HH:mm') : ''}
      />
    </div>
  ) : (
    <p className="text-center pb-2 h-11">Please select a date!</p>
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <div className="flex items-center">
        <PopoverTrigger asChild className="z-10">
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal rounded-r-none',
              !selectedDateTime && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateTime ? (
              selectedDateTime.toFormat('DDD HH:mm')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <Button
          variant="outline"
          onClick={() => {
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
          disabled={(date) =>
            disablePastDays
              ? date < addDays(new Date(), -1)
              : false
          }
          selected={selectedDateTime ? selectedDateTime.toJSDate() : undefined}
          onSelect={handleSelect}
          initialFocus
        />
        {footer}
      </PopoverContent>
    </Popover>
  )
}
