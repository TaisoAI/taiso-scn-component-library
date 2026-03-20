import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

export function ResizableDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Horizontal</h3>
        <ResizablePanelGroup direction="horizontal" className="max-w-2xl rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">Panel One</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">Panel Two</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Three Panels</h3>
        <ResizablePanelGroup direction="horizontal" className="max-w-2xl rounded-lg border">
          <ResizablePanel defaultSize={25} minSize={15}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="text-sm font-semibold">Sidebar</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="text-sm font-semibold">Content</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={15}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="text-sm font-semibold">Details</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Vertical</h3>
        <ResizablePanelGroup direction="vertical" className="max-w-md rounded-lg border">
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full min-h-[80px] items-center justify-center p-6">
              <span className="text-sm font-semibold">Header</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full min-h-[120px] items-center justify-center p-6">
              <span className="text-sm font-semibold">Body</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>
    </div>
  )
}
