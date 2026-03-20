import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function TextareaDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <div className="max-w-lg">
          <Textarea placeholder="Type your message here..." />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Label</h3>
        <div className="max-w-lg space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself..." />
          <p className="text-xs text-muted-foreground">Write a short bio for your profile.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Disabled</h3>
        <div className="max-w-lg">
          <Textarea disabled placeholder="This textarea is disabled" />
        </div>
      </section>
    </div>
  )
}
