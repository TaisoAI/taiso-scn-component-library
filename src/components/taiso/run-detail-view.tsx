import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  CpuIcon,
  AlertCircleIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface TraceStep {
  id: string
  name: string
  type: "tool" | "llm" | "decision" | "state"
  status: "completed" | "failed" | "skipped" | "running"
  duration: string
  input: string
  output: string
}

const STATUS_CONFIG: Record<TraceStep["status"], { icon: React.ReactNode; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  completed: { icon: <CheckCircle2Icon className="size-3.5 text-green-500" />, variant: "default" },
  failed: { icon: <XCircleIcon className="size-3.5 text-red-500" />, variant: "destructive" },
  skipped: { icon: <ClockIcon className="size-3.5 text-muted-foreground" />, variant: "outline" },
  running: { icon: <CpuIcon className="size-3.5 animate-pulse" />, variant: "secondary" },
}

const TYPE_LABELS: Record<TraceStep["type"], string> = {
  tool: "Tool",
  llm: "LLM",
  decision: "Decision",
  state: "State",
}

const MOCK_STEPS: TraceStep[] = [
  {
    id: "step1", name: "Extract document text", type: "tool", status: "completed", duration: "12.3s",
    input: '{"file_id": "f_abc123", "mode": "ocr+digital"}',
    output: '{"text": "Patient record #4521...\\n(2,847 characters extracted)", "pages": 12, "confidence": 0.94}',
  },
  {
    id: "step2", name: "Analyze compliance", type: "llm", status: "completed", duration: "8.7s",
    input: '{"model": "gpt-4-turbo", "prompt": "Analyze the following document for HIPAA compliance..."}',
    output: '{"findings": [{"rule": "164.502(a)", "status": "compliant"}, {"rule": "164.530(c)", "status": "non-compliant", "reason": "Missing retention schedule"}], "confidence": 0.91}',
  },
  {
    id: "step3", name: "Check retention policy", type: "decision", status: "completed", duration: "0.1s",
    input: '{"condition": "findings.any(f => f.status === \'non-compliant\')"}',
    output: '{"result": true, "next": "generate_remediation"}',
  },
  {
    id: "step4", name: "Generate remediation steps", type: "llm", status: "completed", duration: "6.2s",
    input: '{"model": "gpt-4-turbo", "prompt": "Generate remediation steps for: Missing retention schedule..."}',
    output: '{"steps": ["Define document retention schedule per 164.530(c)", "Implement automated purge policy", "Train staff on new retention procedures"]}',
  },
  {
    id: "step5", name: "Save compliance report", type: "tool", status: "failed", duration: "0.8s",
    input: '{"tool": "file-write", "path": "/outputs/compliance-report.json"}',
    output: '{"error": "Permission denied: insufficient write access to /outputs/"}',
  },
]

const MOCK_INPUT = `{
  "project_id": "proj_x7k9m2",
  "sop_ref": "compliance-checker",
  "version": 5,
  "input_file_ids": ["f_abc123"],
  "manual_data": {
    "regulation": "HIPAA",
    "strict_mode": true
  }
}`

const MOCK_OUTPUT = `{
  "status": "partial_failure",
  "findings_count": 2,
  "compliant": 1,
  "non_compliant": 1,
  "remediation_steps": 3,
  "error": "Failed to save report file"
}`

export function RunDetailView({ className }: { className?: string }) {
  const completedSteps = MOCK_STEPS.filter((s) => s.status === "completed").length
  const totalSteps = MOCK_STEPS.length
  const progressPct = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Compliance Checker</h3>
                <Badge variant="outline">v5</Badge>
                <Badge variant="destructive">Partial Failure</Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span>Run ID: run_8f4k2m</span>
                <span>Started: Mar 22, 2:15 PM</span>
                <span>Duration: 28.1s</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progressPct} className="flex-1" />
            <span className="text-xs text-muted-foreground">{completedSteps}/{totalSteps} steps</span>
          </div>
        </CardContent>
      </Card>

      {/* Detail Tabs */}
      <Tabs defaultValue="trace">
        <TabsList>
          <TabsTrigger value="trace">Trace ({totalSteps})</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="outputs">Outputs</TabsTrigger>
          <TabsTrigger value="errors">Errors (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="trace">
          <Card>
            <CardContent className="pt-4">
              <ScrollArea className="h-[400px]">
                <Accordion type="multiple" defaultValue={["step5"]}>
                  {MOCK_STEPS.map((step) => {
                    const config = STATUS_CONFIG[step.status]
                    return (
                      <AccordionItem key={step.id} value={step.id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {config.icon}
                            <span className="font-medium truncate">{step.name}</span>
                            <Badge variant="outline" className="text-[10px] shrink-0">{TYPE_LABELS[step.type]}</Badge>
                            <span className="text-xs text-muted-foreground shrink-0 ml-auto mr-2">{step.duration}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-7">
                            <div>
                              <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Input</h5>
                              <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-x-auto">{step.input}</pre>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Output</h5>
                              <pre className={cn(
                                "rounded-md p-3 text-xs font-mono overflow-x-auto",
                                step.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-muted"
                              )}>{step.output}</pre>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs">
          <Card>
            <CardContent className="pt-4">
              <pre className="rounded-md bg-muted p-4 text-xs font-mono overflow-x-auto">{MOCK_INPUT}</pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outputs">
          <Card>
            <CardContent className="pt-4">
              <pre className="rounded-md bg-muted p-4 text-xs font-mono overflow-x-auto">{MOCK_OUTPUT}</pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardContent className="pt-4">
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Step Failed: Save compliance report</AlertTitle>
                <AlertDescription>
                  <p>Permission denied: insufficient write access to /outputs/</p>
                  <p className="mt-2 text-xs">Step ID: step5 | Type: tool (file-write) | Duration: 0.8s</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
