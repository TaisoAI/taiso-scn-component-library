import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'

export function HoverCardDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">User Profile</h3>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="px-0">@shadcn</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@shadcn</h4>
                <p className="text-sm">The creator of shadcn/ui and taxonomy.</p>
                <div className="flex items-center pt-2">
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-muted-foreground">Joined December 2021</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Simple Info</h3>
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="text-sm underline decoration-dashed cursor-pointer">What is React?</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <p className="text-sm">A JavaScript library for building user interfaces, maintained by Meta and a community of developers.</p>
          </HoverCardContent>
        </HoverCard>
      </section>
    </div>
  )
}
