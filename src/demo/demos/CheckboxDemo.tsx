import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function CheckboxDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Checked</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="checked" defaultChecked />
          <Label htmlFor="checked">Remember me</Label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Multiple Options</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notif" defaultChecked />
            <Label htmlFor="email-notif">Email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sms-notif" />
            <Label htmlFor="sms-notif">SMS notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push-notif" defaultChecked />
            <Label htmlFor="push-notif">Push notifications</Label>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Disabled</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled" disabled />
          <Label htmlFor="disabled" className="text-muted-foreground">Disabled checkbox</Label>
        </div>
      </section>
    </div>
  )
}
