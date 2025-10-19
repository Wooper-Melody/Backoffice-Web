"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export interface DatePickerWithRangeProps {
  className?: string
  value?: DateRange
  onValueChange?: (date: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePickerWithRange({ 
  className, 
  value, 
  onValueChange,
  placeholder = "Pick a date range",
  disabled = false
}: DatePickerWithRangeProps) {
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range) return null
    
    const { from, to } = range
    if (!from) return null
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }
    
    if (to) {
      return `${from.toLocaleDateString('en-US', formatOptions)} - ${to.toLocaleDateString('en-US', formatOptions)}`
    }
    
    return from.toLocaleDateString('en-US', formatOptions)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(value) || <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onValueChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
