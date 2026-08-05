"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateRangePicker({
  className,
  date,
  setDate,
}) {
  return (
    <div className={className}>
      <Label htmlFor="date-picker-range" className="sr-only">Date Picker Range</Label>
      <Popover>
        <PopoverTrigger render={
          <Button
            id="date-picker-range"
            variant={"outline"}
            className={
              `w-[260px] justify-start text-left font-normal border-white/5 bg-secondary-container/50 hover:bg-secondary-container text-white/90 ${
                !date && "text-muted-foreground"
              }`
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        } />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
