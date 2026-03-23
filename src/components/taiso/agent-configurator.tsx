import { useState } from "react"
import {
  CheckCircle2Icon,
  AlertCircleIcon,
  SaveIcon,
  PlayIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from "@/components/ui/collapsible"

const MOCK_YAML = `name: compliance-checker
version: "1.0"
goal: Check documents for regulatory compliance
description: Validates uploaded documents against compliance requirements

inputs:
  - name: document
    type: file
    description: The document to check
    required: true
  - name: regulation
    type: text
    description: Which regulation to check against
    default: HIPAA

steps:
  - id: extract
    description: Extract text from document
    type: tool
    tool: pdf-extract
    input:
      file_id: "{{inputs.document}}"

  - id: analyze
    description: Analyze compliance
    type: llm
    model: gpt-4-turbo
    prompt: |
      Analyze the following document for {{inputs.regulation}} compliance.
      Document: {{steps.extract.output}}

  - id: report
    description: Generate compliance report
    type: sop
    sop: report-generator
    input:
      findings: "{{steps.analyze.output}}"

settings:
  max_retries: 2
  timeout: 120

tags:
  - compliance
  - audit
  - healthcare`

const TOOL_GROUPS = [
  { label: "Web", tools: ["web-search", "web-crawl", "html-to-markdown"] },
  { label: "PDF", tools: ["pdf-extract", "pdf-convert"] },
  { label: "Code", tools: ["code-execute"] },
  { label: "Text", tools: ["text-search", "text-replace", "text-diff"] },
]

const MODELS = [
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
]

export function AgentConfigurator({ className }: { className?: string }) {
  const [validationStatus, setValidationStatus] = useState<"idle" | "valid" | "error">("idle")

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Agent Configurator</CardTitle>
        <CardDescription>Create or edit an agent definition</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="configure">
          <TabsList>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input defaultValue="compliance-checker" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Version</label>
                <Input defaultValue="1.0" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Goal</label>
              <Input defaultValue="Check documents for regulatory compliance" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                defaultValue="Validates uploaded documents against compliance requirements"
                rows={2}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Default Model</label>
              <Select defaultValue="gpt-4-turbo">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <label className="text-sm font-medium">Tools</label>
              {TOOL_GROUPS.map((group) => (
                <Collapsible key={group.label}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    {group.label}
                    <Badge variant="outline" className="text-[10px]">{group.tools.length}</Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 ml-4 space-y-2">
                      {group.tools.map((tool) => (
                        <label key={tool} className="flex items-center gap-2 text-sm">
                          <Checkbox defaultChecked={tool === "pdf-extract"} />
                          <code className="text-xs font-mono">{tool}</code>
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {["compliance", "audit", "healthcare"].map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="yaml" className="pt-4">
            <Textarea
              className="font-mono text-xs min-h-[400px] leading-relaxed"
              defaultValue={MOCK_YAML}
            />
          </TabsContent>
        </Tabs>

        {validationStatus === "valid" && (
          <Alert className="mt-4">
            <CheckCircle2Icon className="text-green-500" />
            <AlertTitle>Validation Passed</AlertTitle>
            <AlertDescription>Agent YAML is valid and ready to compile.</AlertDescription>
          </Alert>
        )}
        {validationStatus === "error" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon />
            <AlertTitle>Validation Failed</AlertTitle>
            <AlertDescription>Step "extract" references unknown tool "pdf-extraxt". Did you mean "pdf-extract"?</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" onClick={() => setValidationStatus(validationStatus === "valid" ? "error" : "valid")}>
          <PlayIcon /> Validate
        </Button>
        <Button><SaveIcon /> Save Agent</Button>
      </CardFooter>
    </Card>
  )
}
