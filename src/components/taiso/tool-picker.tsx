import { useState } from "react"
import {
  WrenchIcon,
  GlobeIcon,
  FileTextIcon,
  CodeIcon,
  CalculatorIcon,
  SearchIcon,
  ClockIcon,
  TextIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  params?: string[]
}

const CATEGORIES: Record<string, { icon: React.ReactNode; label: string }> = {
  web: { icon: <GlobeIcon className="size-4" />, label: "Web" },
  pdf: { icon: <FileTextIcon className="size-4" />, label: "PDF" },
  code: { icon: <CodeIcon className="size-4" />, label: "Code" },
  math: { icon: <CalculatorIcon className="size-4" />, label: "Math" },
  search: { icon: <SearchIcon className="size-4" />, label: "Search" },
  text: { icon: <TextIcon className="size-4" />, label: "Text" },
  time: { icon: <ClockIcon className="size-4" />, label: "Time" },
}

const MOCK_TOOLS: Tool[] = [
  { id: "web-search", name: "Web Search", description: "Search the web using DuckDuckGo or Google", category: "web", params: ["query", "num_results", "region"] },
  { id: "web-crawl", name: "Web Crawl", description: "Crawl a web page and extract content", category: "web", params: ["url", "format"] },
  { id: "html-to-markdown", name: "HTML to Markdown", description: "Convert HTML content to Markdown", category: "web", params: ["html"] },
  { id: "pdf-extract", name: "PDF Extract", description: "Extract text and tables from PDF documents", category: "pdf", params: ["file_id", "pages", "mode"] },
  { id: "pdf-convert", name: "PDF Convert", description: "Convert documents to PDF format", category: "pdf", params: ["file_id", "options"] },
  { id: "code-execute", name: "Code Execute", description: "Run Python code in a sandboxed environment", category: "code", params: ["code", "timeout"] },
  { id: "calc", name: "Calculator", description: "Evaluate mathematical expressions", category: "math", params: ["expression"] },
  { id: "expression-eval", name: "Expression Eval", description: "Evaluate complex expressions with variables", category: "math", params: ["expression", "variables"] },
  { id: "pubmed-search", name: "PubMed Search", description: "Search medical literature on PubMed", category: "search", params: ["query", "max_results", "sort"] },
  { id: "text-search", name: "Text Search", description: "Search for patterns in text content", category: "text", params: ["text", "pattern", "flags"] },
  { id: "text-replace", name: "Text Replace", description: "Find and replace text patterns", category: "text", params: ["text", "find", "replace"] },
  { id: "text-diff", name: "Text Diff", description: "Compare two text strings and show differences", category: "text", params: ["text_a", "text_b"] },
  { id: "time-now", name: "Current Time", description: "Get the current date and time", category: "time", params: ["timezone"] },
  { id: "time-diff", name: "Time Difference", description: "Calculate difference between two timestamps", category: "time", params: ["start", "end", "unit"] },
]

export function ToolPicker({ className }: { className?: string }) {
  const [selected, setSelected] = useState<Tool | null>(null)

  const grouped = Object.entries(CATEGORIES).map(([key, config]) => ({
    ...config,
    key,
    tools: MOCK_TOOLS.filter((t) => t.category === key),
  })).filter((g) => g.tools.length > 0)

  return (
    <div className={cn("flex gap-4", className)}>
      <Command className="w-full max-w-sm rounded-lg border">
        <CommandInput placeholder="Search tools..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No tools found.</CommandEmpty>
          {grouped.map((group, idx) => (
            <div key={group.key}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={group.label}>
                {group.tools.map((tool) => (
                  <CommandItem
                    key={tool.id}
                    value={tool.name}
                    onSelect={() => setSelected(tool)}
                    className="gap-2"
                  >
                    {CATEGORIES[tool.category].icon}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm">{tool.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{group.label}</Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </Command>

      {selected && (
        <Card className="flex-1 self-start">
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {CATEGORIES[selected.category]?.icon}
              <h3 className="font-semibold">{selected.name}</h3>
              <Badge variant="secondary">{CATEGORIES[selected.category]?.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
            {selected.params && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Parameters</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.params.map((p) => (
                      <Badge key={p} variant="outline" className="font-mono text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
