import { useState } from "react"
import { SearchIcon, BookOpenIcon, UsersIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

interface SOPCatalogItem {
  id: string
  name: string
  description: string
  categories: string[]
  usageCount: number
  author: string
}

const MOCK_CATALOG: SOPCatalogItem[] = [
  { id: "s1", name: "Document Extraction Pipeline", description: "Extract structured data from PDF documents using OCR and LLM-based parsing with validation.", categories: ["extraction", "pdf"], usageCount: 1240, author: "Taiso Team" },
  { id: "s2", name: "Research Paper Summarizer", description: "Summarize academic papers with key findings, methodology, and citation extraction.", categories: ["research", "summarization"], usageCount: 890, author: "Taiso Team" },
  { id: "s3", name: "Compliance Audit Checker", description: "Validate documents against regulatory compliance requirements with evidence-based citations.", categories: ["compliance", "audit"], usageCount: 654, author: "Community" },
  { id: "s4", name: "Data Validation Agent", description: "Validate CSV/JSON data against schema definitions with detailed error reporting.", categories: ["validation", "data"], usageCount: 432, author: "Community" },
  { id: "s5", name: "Multi-Source Search & Synthesize", description: "Search across multiple data sources and synthesize findings into a structured report.", categories: ["search", "research"], usageCount: 321, author: "Taiso Team" },
  { id: "s6", name: "Invoice Processing", description: "Extract line items, totals, and vendor information from invoice documents.", categories: ["extraction", "finance"], usageCount: 278, author: "Community" },
]

const ALL_CATEGORIES = [...new Set(MOCK_CATALOG.flatMap((s) => s.categories))].sort()

export function SOPCatalogBrowser({ className }: { className?: string }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("popular")

  let filtered = MOCK_CATALOG.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  )

  if (category !== "all") {
    filtered = filtered.filter((s) => s.categories.includes(category))
  }

  if (sort === "popular") {
    filtered.sort((a, b) => b.usageCount - a.usageCount)
  } else if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ALL_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><BookOpenIcon /></EmptyMedia>
            <EmptyTitle>No SOPs found</EmptyTitle>
            <EmptyDescription>Try different keywords or clear filters.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sop) => (
            <Card key={sop.id}>
              <CardHeader>
                <CardTitle className="text-base">{sop.name}</CardTitle>
                <CardDescription className="line-clamp-2">{sop.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {sop.categories.map((c) => (
                    <Badge key={c} variant="outline" className="text-[10px] capitalize">{c}</Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><UsersIcon className="size-3" /> {sop.usageCount.toLocaleString()} uses</span>
                  <span>by {sop.author}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  Use This <ArrowRightIcon />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
