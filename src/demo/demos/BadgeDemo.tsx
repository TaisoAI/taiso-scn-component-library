import { Badge } from '@/components/ui/badge'

export function BadgeDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Variants</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Use Cases</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>New</Badge>
          <Badge variant="secondary">In Progress</Badge>
          <Badge variant="outline">Draft</Badge>
          <Badge variant="destructive">Removed</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Status Indicators</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Active</Badge>
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Pending</Badge>
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Expired</Badge>
        </div>
      </section>
    </div>
  )
}
