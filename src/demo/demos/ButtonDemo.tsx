import { Button } from '@/components/ui/button'
import { Mail, Plus, Trash2, Loader2, ChevronRight } from 'lucide-react'

export function ButtonDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Variants</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Icons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button><Mail /> Login with Email</Button>
          <Button variant="outline"><Plus /> New Project</Button>
          <Button variant="destructive"><Trash2 /> Delete</Button>
          <Button variant="secondary">Next <ChevronRight /></Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Icon Buttons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon"><Plus /></Button>
          <Button size="icon-sm" variant="outline"><Mail /></Button>
          <Button size="icon-lg" variant="secondary"><Trash2 /></Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">States</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button disabled><Loader2 className="animate-spin" /> Loading</Button>
        </div>
      </section>
    </div>
  )
}
