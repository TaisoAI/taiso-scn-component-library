'use client'

import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'

export function CollapsibleDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="max-w-sm space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">3 starred repositories</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 text-sm">
            @radix-ui/primitives
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-2 text-sm">
              @radix-ui/colors
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              @stitches/react
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Simple Toggle</h3>
        <Collapsible className="max-w-sm">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">Show Details</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="rounded-md border p-4 text-sm space-y-2">
              <p>These are the additional details that were hidden.</p>
              <p className="text-muted-foreground">Click the button again to collapse.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  )
}
