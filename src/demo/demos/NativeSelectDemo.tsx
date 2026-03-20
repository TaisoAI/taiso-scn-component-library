import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

export function NativeSelectDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <NativeSelect defaultValue="react">
          <NativeSelectOption value="react">React</NativeSelectOption>
          <NativeSelectOption value="vue">Vue</NativeSelectOption>
          <NativeSelectOption value="svelte">Svelte</NativeSelectOption>
          <NativeSelectOption value="angular">Angular</NativeSelectOption>
        </NativeSelect>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Label</h3>
        <div className="space-y-2">
          <Label htmlFor="framework">Framework</Label>
          <NativeSelect id="framework" defaultValue="">
            <NativeSelectOption value="" disabled>Select a framework</NativeSelectOption>
            <NativeSelectOption value="react">React</NativeSelectOption>
            <NativeSelectOption value="vue">Vue</NativeSelectOption>
            <NativeSelectOption value="svelte">Svelte</NativeSelectOption>
            <NativeSelectOption value="angular">Angular</NativeSelectOption>
          </NativeSelect>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Disabled</h3>
        <NativeSelect disabled defaultValue="react">
          <NativeSelectOption value="react">React</NativeSelectOption>
          <NativeSelectOption value="vue">Vue</NativeSelectOption>
        </NativeSelect>
      </section>
    </div>
  )
}
