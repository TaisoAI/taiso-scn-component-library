import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export function RadioDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="r3" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Plan Selection</h3>
        <RadioGroup defaultValue="pro">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="plan-free" />
            <Label htmlFor="plan-free">Free - $0/month</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="plan-pro" />
            <Label htmlFor="plan-pro">Pro - $9/month</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="plan-enterprise" />
            <Label htmlFor="plan-enterprise">Enterprise - $29/month</Label>
          </div>
        </RadioGroup>
      </section>
    </div>
  )
}
