import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

export function CommandDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Command Palette</h3>
        <Command className="max-w-md rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" /> Calendar
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" /> Search Emoji
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" /> Calculator
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" /> Profile
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" /> Billing
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </section>
    </div>
  )
}
