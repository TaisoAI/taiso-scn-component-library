import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function SwitchDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <div className="flex items-center space-x-2">
          <Switch id="airplane" />
          <Label htmlFor="airplane">Airplane Mode</Label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Checked</h3>
        <div className="flex items-center space-x-2">
          <Switch id="dark-mode" defaultChecked />
          <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Settings List</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between max-w-sm">
            <Label htmlFor="notifications">Push Notifications</Label>
            <Switch id="notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between max-w-sm">
            <Label htmlFor="marketing">Marketing Emails</Label>
            <Switch id="marketing" />
          </div>
          <div className="flex items-center justify-between max-w-sm">
            <Label htmlFor="updates">Product Updates</Label>
            <Switch id="updates" defaultChecked />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Disabled</h3>
        <div className="flex items-center space-x-2">
          <Switch id="disabled-switch" disabled />
          <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled</Label>
        </div>
      </section>
    </div>
  )
}
