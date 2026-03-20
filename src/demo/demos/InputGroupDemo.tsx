import { Mail, Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

export function InputGroupDemo() {
  return (
    <div className="space-y-8 max-w-sm">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Prefix Icon</h3>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText><Search /></InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search..." />
        </InputGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Suffix Icon</h3>
        <InputGroup>
          <InputGroupInput placeholder="Email address" />
          <InputGroupAddon align="inline-end">
            <InputGroupText><Mail /></InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Text Addons</h3>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      </section>
    </div>
  )
}
