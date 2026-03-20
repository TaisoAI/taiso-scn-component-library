import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

export function DrawerDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>Set your daily activity goal.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-center">
                    <div className="text-7xl font-bold tracking-tighter">350</div>
                    <div className="text-sm text-muted-foreground">calories/day</div>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">With Content</h3>
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Confirm Order</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Order Summary</DrawerTitle>
                <DrawerDescription>Review your order before submitting.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Widget Pro</span>
                  <span>$29.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>$4.99</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>$34.98</span>
                </div>
              </div>
              <DrawerFooter>
                <Button>Place Order</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </section>
    </div>
  )
}
