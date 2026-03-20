import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'

export function ContextMenuDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Right Click Area</h3>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Save As...</ContextMenuItem>
            <ContextMenuItem>Print</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>View Page Source</ContextMenuItem>
            <ContextMenuItem>Inspect</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">File Actions</h3>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[100px] w-[300px] items-center justify-center rounded-md border bg-muted/30 text-sm">
            document.pdf
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Download</ContextMenuItem>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Share</ContextMenuItem>
            <ContextMenuItem>Move to...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>
    </div>
  )
}
