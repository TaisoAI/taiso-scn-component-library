'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

export function SliderDemo() {
  const [value, setValue] = useState([50])
  const [range, setRange] = useState([25, 75])

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <div className="max-w-sm">
          <Slider defaultValue={[33]} max={100} step={1} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Value Display</h3>
        <div className="max-w-sm space-y-2">
          <div className="flex items-center justify-between">
            <Label>Volume</Label>
            <span className="text-sm text-muted-foreground">{value[0]}%</span>
          </div>
          <Slider value={value} onValueChange={setValue} max={100} step={1} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Range</h3>
        <div className="max-w-sm space-y-2">
          <div className="flex items-center justify-between">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">${range[0]} - ${range[1]}</span>
          </div>
          <Slider value={range} onValueChange={setRange} max={100} step={1} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Steps</h3>
        <div className="max-w-sm">
          <Slider defaultValue={[50]} max={100} step={25} />
        </div>
      </section>
    </div>
  )
}
