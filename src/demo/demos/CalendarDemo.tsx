'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Single Date</h3>
        <div className="flex flex-col items-start gap-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <p className="text-sm text-muted-foreground">
            Selected: {date ? date.toLocaleDateString() : 'None'}
          </p>
        </div>
      </section>
    </div>
  )
}
