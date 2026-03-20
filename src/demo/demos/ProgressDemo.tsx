import { Progress } from '@/components/ui/progress'

export function ProgressDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <div className="max-w-md space-y-4">
          <Progress value={33} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Various Values</h3>
        <div className="max-w-md space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>0%</span>
              <span className="text-muted-foreground">Not started</span>
            </div>
            <Progress value={0} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>25%</span>
              <span className="text-muted-foreground">In progress</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>50%</span>
              <span className="text-muted-foreground">Halfway</span>
            </div>
            <Progress value={50} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>75%</span>
              <span className="text-muted-foreground">Almost done</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>100%</span>
              <span className="text-muted-foreground">Complete</span>
            </div>
            <Progress value={100} />
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Indeterminate</h3>
        <div className="max-w-md space-y-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Loading...</span>
            <Progress />
          </div>
        </div>
      </section>
    </div>
  )
}
