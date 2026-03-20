import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const tags = Array.from({ length: 50 }).map(
  (_, i) => `v1.${i}.0-beta`
)

export function ScrollAreaDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Vertical Scroll</h3>
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <div key={tag}>
                <div className="text-sm">{tag}</div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Horizontal Scroll</h3>
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md border bg-muted/30"
              >
                <span className="text-sm">Item {i + 1}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>
    </div>
  )
}
