import { Input } from '@/components/ui/input'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field'

export function FieldDemo() {
  return (
    <div className="space-y-8 max-w-sm">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Label</h3>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="Enter your name" />
        </Field>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Description</h3>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" />
          <FieldDescription>We will never share your email with anyone.</FieldDescription>
        </Field>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Error</h3>
        <Field data-invalid="true">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" aria-invalid="true" defaultValue="ab" />
          <FieldError>Username must be at least 3 characters.</FieldError>
        </Field>
      </section>
    </div>
  )
}
