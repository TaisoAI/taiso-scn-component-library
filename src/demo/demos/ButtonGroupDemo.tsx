import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

export function ButtonGroupDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Variants</h3>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonGroup>
            <Button>Save</Button>
            <Button variant="secondary">Draft</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Year</Button>
            <Button variant="outline">Month</Button>
            <Button variant="outline">Week</Button>
          </ButtonGroup>
        </div>
      </section>
    </div>
  )
}
