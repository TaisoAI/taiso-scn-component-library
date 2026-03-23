import { GitBranchIcon, RotateCcwIcon, EyeIcon, AlertTriangleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface Version {
  version: number
  author: string
  timestamp: string
  summary: string
  isBreaking: boolean
  isCurrent: boolean
}

const MOCK_VERSIONS: Version[] = [
  { version: 5, author: "Sarah Chen", timestamp: "Mar 22, 2024 at 2:15 PM", summary: "Added retry logic to extraction step and increased timeout to 60s", isBreaking: false, isCurrent: true },
  { version: 4, author: "James Wilson", timestamp: "Mar 18, 2024 at 10:30 AM", summary: "Changed input schema: renamed 'patient_id' to 'record_id' across all blocks", isBreaking: true, isCurrent: false },
  { version: 3, author: "Sarah Chen", timestamp: "Mar 10, 2024 at 4:45 PM", summary: "Added compliance validation step after data extraction", isBreaking: false, isCurrent: false },
  { version: 2, author: "Maria Garcia", timestamp: "Feb 28, 2024 at 9:00 AM", summary: "Updated LLM model from gpt-4 to gpt-4-turbo for faster processing", isBreaking: false, isCurrent: false },
  { version: 1, author: "Sarah Chen", timestamp: "Jan 15, 2024 at 11:20 AM", summary: "Initial version: 3-step extraction pipeline with validation", isBreaking: false, isCurrent: false },
]

export function VersionTimeline({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>Track changes and rollback when needed</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px]">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-0">
              {MOCK_VERSIONS.map((v, idx) => (
                <div key={v.version} className="relative pl-10 pb-6 last:pb-0">
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-[9px] top-1 size-3 rounded-full border-2",
                    v.isCurrent
                      ? "border-primary bg-primary"
                      : "border-border bg-background"
                  )} />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={v.isCurrent ? "default" : "outline"}>
                        v{v.version}
                      </Badge>
                      {v.isCurrent && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                      {v.isBreaking && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangleIcon className="size-3" /> Breaking
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm">{v.summary}</p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{v.author}</span>
                      <span>{v.timestamp}</span>
                    </div>

                    {!v.isCurrent && (
                      <div className="flex gap-2 pt-1">
                        <Button variant="outline" size="xs"><EyeIcon /> View</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="xs"><RotateCcwIcon /> Rollback</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Rollback to v{v.version}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will create a new version (v{MOCK_VERSIONS[0].version + 1}) with the definition from v{v.version}. The current version will be preserved in history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>Rollback</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  {idx < MOCK_VERSIONS.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
