import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function AlertDemo() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Default</h3>
        <Alert className="max-w-lg">
          <Info className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Destructive</h3>
        <Alert variant="destructive" className="max-w-lg">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Custom Styled</h3>
        <div className="max-w-lg space-y-3">
          <Alert className="border-green-500/50 text-green-600 [&>svg]:text-green-600">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>
          <Alert className="border-yellow-500/50 text-yellow-600 [&>svg]:text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Your free trial is about to expire.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  )
}
