import { useState } from "react"
import { SearchIcon, FileTextIcon, DatabaseIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

interface SearchResult {
  id: string
  title: string
  snippet: string
  source: string
  sourceType: "file" | "database"
  relevance: number
  timestamp: string
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "r1",
    title: "Compliance Guidelines Section 4.2",
    snippet: "All patient data must be encrypted at rest using AES-256 encryption and transmitted over TLS 1.3 or higher...",
    source: "compliance-guidelines.pdf",
    sourceType: "file",
    relevance: 0.95,
    timestamp: "Page 42",
  },
  {
    id: "r2",
    title: "Data Retention Policy",
    snippet: "Records must be retained for a minimum of seven years following the last date of service...",
    source: "quarterly-report-q4.pdf",
    sourceType: "file",
    relevance: 0.87,
    timestamp: "Page 15",
  },
  {
    id: "r3",
    title: "Patient Data Schema v2",
    snippet: "The updated schema includes fields for emergency contacts, insurance verification status, and consent timestamps...",
    source: "patient-data-2024.csv",
    sourceType: "database",
    relevance: 0.72,
    timestamp: "Row 1-50",
  },
]

function ResultCard({ result }: { result: SearchResult }) {
  const relevanceColor = result.relevance >= 0.9 ? "text-green-600 dark:text-green-400" : result.relevance >= 0.7 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"

  return (
    <Card className="py-3 shadow-none">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-snug">{result.title}</h4>
          <span className={cn("shrink-0 text-xs font-mono font-medium", relevanceColor)}>
            {Math.round(result.relevance * 100)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{result.snippet}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-[10px]">
            {result.sourceType === "file" ? <FileTextIcon className="size-3" /> : <DatabaseIcon className="size-3" />}
            {result.source}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{result.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length > 2 && !hasSearched) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setHasSearched(true)
      }, 600)
    }
    if (value.length <= 2) {
      setHasSearched(false)
    }
  }

  const results = hasSearched ? MOCK_RESULTS : []

  return (
    <div className={cn("w-full space-y-3", className)}>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search project data..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </InputGroup>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="py-3 shadow-none">
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <Empty className="py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon"><SearchIcon /></EmptyMedia>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>Try different keywords or broaden your search.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!loading && results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{results.length} results</span>
            <Badge variant="outline" className="text-[10px]">Hybrid Search (Vector + BM25)</Badge>
          </div>
          <ScrollArea className="h-[360px]">
            <div className="space-y-2">
              {results.map((r) => <ResultCard key={r.id} result={r} />)}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
