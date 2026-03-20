import { Kbd, KbdGroup } from '@/components/ui/kbd'

export function KbdDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Single Key</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Alt</Kbd>
          <Kbd>Enter</Kbd>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Key Combinations</h3>
        <div className="flex flex-wrap items-center gap-3">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>C</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Inline with Text</h3>
        <p className="text-sm">
          Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.
        </p>
        <p className="text-sm">
          Use <Kbd>Ctrl</Kbd> <Kbd>C</Kbd> to copy and <Kbd>Ctrl</Kbd> <Kbd>V</Kbd> to paste.
        </p>
      </section>
    </div>
  )
}
