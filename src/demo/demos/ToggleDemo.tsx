import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

export function ToggleDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
          <Toggle aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
          <Toggle aria-label="Toggle underline"><Underline className="h-4 w-4" /></Toggle>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Variants</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle variant="default" aria-label="Toggle default"><Bold className="h-4 w-4" /></Toggle>
          <Toggle variant="outline" aria-label="Toggle outline"><Italic className="h-4 w-4" /></Toggle>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Text</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /> Bold</Toggle>
          <Toggle aria-label="Toggle italic"><Italic className="h-4 w-4" /> Italic</Toggle>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Toggle Group (Single)</h3>
        <ToggleGroup type="single" defaultValue="center">
          <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Toggle Group (Multiple)</h3>
        <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
          <ToggleGroupItem value="bold" aria-label="Toggle bold"><Bold className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic"><Italic className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline"><Underline className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Disabled</h3>
        <Toggle disabled aria-label="Disabled toggle"><Bold className="h-4 w-4" /></Toggle>
      </section>
    </div>
  )
}
