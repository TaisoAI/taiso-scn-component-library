import { useState } from "react"
import {
  PlayIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  XIcon,
  LoaderIcon,
  InboxIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import {
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from "@/components/ui/collapsible"

type JobStatus = "pending" | "running" | "completed" | "failed"

interface Job {
  id: string
  name: string
  type: "sop_execution" | "agent_execution" | "file_processing"
  status: JobStatus
  progress?: number
  elapsed?: string
  result?: string
  error?: string
  createdAt: string
}

const STATUS_CONFIG: Record<JobStatus, { icon: React.ReactNode; variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
  pending: { icon: <ClockIcon className="size-3.5" />, variant: "outline", label: "Pending" },
  running: { icon: <LoaderIcon className="size-3.5 animate-spin" />, variant: "secondary", label: "Running" },
  completed: { icon: <CheckCircle2Icon className="size-3.5" />, variant: "default", label: "Completed" },
  failed: { icon: <XCircleIcon className="size-3.5" />, variant: "destructive", label: "Failed" },
}

const TYPE_LABELS: Record<Job["type"], string> = {
  sop_execution: "SOP",
  agent_execution: "Agent",
  file_processing: "File",
}

const MOCK_JOBS: Job[] = [
  { id: "j1", name: "Extract patient data", type: "sop_execution", status: "running", progress: 45, elapsed: "1m 23s", createdAt: "2 min ago" },
  { id: "j2", name: "Compliance audit agent", type: "agent_execution", status: "running", progress: 78, elapsed: "3m 10s", createdAt: "5 min ago" },
  { id: "j3", name: "Process quarterly-report.pdf", type: "file_processing", status: "pending", createdAt: "1 min ago" },
  { id: "j4", name: "Research summarization", type: "sop_execution", status: "completed", elapsed: "2m 05s", result: "Generated 12 findings with 95% confidence", createdAt: "15 min ago" },
  { id: "j5", name: "Data validation agent", type: "agent_execution", status: "completed", elapsed: "45s", result: "All 24 records validated successfully", createdAt: "30 min ago" },
  { id: "j6", name: "Invoice extraction", type: "sop_execution", status: "failed", elapsed: "12s", error: "Schema validation failed: missing required field 'vendor_name'", createdAt: "1 hour ago" },
]

function JobRow({ job }: { job: Job }) {
  const config = STATUS_CONFIG[job.status]
  return (
    <Collapsible>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{job.name}</span>
            <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[job.type]}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={config.variant} className="gap-1">
              {config.icon} {config.label}
            </Badge>
            {job.elapsed && (
              <span className="text-xs text-muted-foreground">{job.elapsed}</span>
            )}
          </div>
          {job.status === "running" && job.progress != null && (
            <Progress value={job.progress} className="mt-2 h-1.5" />
          )}
        </div>
        <div className="flex items-center gap-1">
          {job.status === "running" && (
            <Button variant="ghost" size="icon-xs"><XIcon /></Button>
          )}
          {(job.result || job.error) && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="xs">Details</Button>
            </CollapsibleTrigger>
          )}
        </div>
      </div>
      {(job.result || job.error) && (
        <CollapsibleContent>
          <div className="px-4 pb-3">
            <div className={cn(
              "rounded-md p-3 text-xs",
              job.error ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}>
              {job.error || job.result}
            </div>
          </div>
        </CollapsibleContent>
      )}
      <Separator />
    </Collapsible>
  )
}

function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <Empty className="py-8">
        <EmptyHeader>
          <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
          <EmptyTitle>No jobs</EmptyTitle>
          <EmptyDescription>No jobs match the current filter.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  return (
    <ScrollArea className="h-[340px]">
      {jobs.map((job) => <JobRow key={job.id} job={job} />)}
    </ScrollArea>
  )
}

export function JobQueuePanel({ className }: { className?: string }) {
  const running = MOCK_JOBS.filter((j) => j.status === "running" || j.status === "pending")
  const completed = MOCK_JOBS.filter((j) => j.status === "completed")
  const failed = MOCK_JOBS.filter((j) => j.status === "failed")

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Job Queue</CardTitle>
        <CardDescription>Background tasks and execution status</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({MOCK_JOBS.length})</TabsTrigger>
            <TabsTrigger value="running">Running ({running.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({failed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all"><JobList jobs={MOCK_JOBS} /></TabsContent>
          <TabsContent value="running"><JobList jobs={running} /></TabsContent>
          <TabsContent value="completed"><JobList jobs={completed} /></TabsContent>
          <TabsContent value="failed"><JobList jobs={failed} /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
