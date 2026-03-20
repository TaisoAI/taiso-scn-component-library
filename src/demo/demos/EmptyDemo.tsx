import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { InboxIcon, Plus } from 'lucide-react'

export function EmptyDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Icon, Title, Description & Action</h3>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              There are no items to display. Get started by creating your first item.
            </EmptyDescription>
          </EmptyHeader>
          <Button>
            <Plus /> Create Item
          </Button>
        </Empty>
      </section>
    </div>
  )
}
