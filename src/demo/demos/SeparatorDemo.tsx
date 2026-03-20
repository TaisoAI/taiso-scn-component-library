import { Separator } from '@/components/ui/separator'

export function SeparatorDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Horizontal</h3>
        <div className="max-w-sm">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
            <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Vertical</h3>
        <div className="flex h-10 items-center space-x-4">
          <span className="text-sm">Dashboard</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Settings</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Profile</span>
        </div>
      </section>
    </div>
  )
}
