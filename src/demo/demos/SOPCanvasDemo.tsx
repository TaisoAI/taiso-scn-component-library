import { SOPCanvas } from '@/components/taiso/sop-canvas'

export function SOPCanvasDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Pan with scroll or Space+drag. Zoom with Ctrl+scroll. Click nodes to select, drag to move. Use toolbar to add nodes.
      </p>
      <div className="h-[560px] w-full">
        <SOPCanvas />
      </div>
    </div>
  )
}
