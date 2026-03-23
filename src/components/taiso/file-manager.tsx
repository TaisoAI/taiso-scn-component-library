import { useState } from "react"
import {
  FileIcon,
  UploadIcon,
  SearchIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  Trash2Icon,
  CogIcon,
  FileTextIcon,
  ImageIcon,
  FileSpreadsheetIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

interface FileItem {
  id: string
  name: string
  type: "pdf" | "csv" | "image" | "text" | "other"
  size: string
  status: "ready" | "processing" | "indexed" | "error"
  progress?: number
  chunks?: number
  updatedAt: string
}

const FILE_ICONS: Record<FileItem["type"], React.ReactNode> = {
  pdf: <FileTextIcon className="size-4 text-red-500" />,
  csv: <FileSpreadsheetIcon className="size-4 text-green-500" />,
  image: <ImageIcon className="size-4 text-blue-500" />,
  text: <FileTextIcon className="size-4 text-muted-foreground" />,
  other: <FileIcon className="size-4 text-muted-foreground" />,
}

const STATUS_BADGE: Record<FileItem["status"], { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  ready: { label: "Ready", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  indexed: { label: "Indexed", variant: "default" },
  error: { label: "Error", variant: "destructive" },
}

const MOCK_FILES: FileItem[] = [
  { id: "1", name: "quarterly-report-q4.pdf", type: "pdf", size: "2.4 MB", status: "indexed", chunks: 42, updatedAt: "2 hours ago" },
  { id: "2", name: "patient-data-2024.csv", type: "csv", size: "1.1 MB", status: "processing", progress: 65, updatedAt: "5 min ago" },
  { id: "3", name: "architecture-diagram.png", type: "image", size: "890 KB", status: "ready", updatedAt: "1 day ago" },
  { id: "4", name: "compliance-guidelines.pdf", type: "pdf", size: "4.7 MB", status: "indexed", chunks: 128, updatedAt: "3 days ago" },
  { id: "5", name: "meeting-notes.txt", type: "text", size: "12 KB", status: "error", updatedAt: "1 hour ago" },
]

export function FileManager({ className }: { className?: string }) {
  const [filter, setFilter] = useState("")
  const filtered = MOCK_FILES.filter((f) => f.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>Manage project files and RAG processing</CardDescription>
        <CardAction>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><UploadIcon /> Upload</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>Drag and drop files or click to browse.</DialogDescription>
              </DialogHeader>
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center">
                <UploadIcon className="size-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drop files here</p>
                  <p className="text-xs text-muted-foreground">PDF, CSV, TXT, images up to 50 MB</p>
                </div>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Filter files..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </InputGroup>

        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><FileIcon /></EmptyMedia>
              <EmptyTitle>No files found</EmptyTitle>
              <EmptyDescription>
                {filter ? "Try a different search term." : "Upload files to get started."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((file) => {
                const statusInfo = STATUS_BADGE[file.status]
                return (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {FILE_ICONS[file.type]}
                        <span className="font-medium">{file.name}</span>
                        {file.chunks != null && (
                          <Badge variant="outline" className="text-[10px]">{file.chunks} chunks</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{file.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        {file.status === "processing" && file.progress != null && (
                          <Progress value={file.progress} className="w-16" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{file.updatedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs"><MoreHorizontalIcon /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><DownloadIcon /> Download</DropdownMenuItem>
                          <DropdownMenuItem><CogIcon /> Process (RAG)</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive"><Trash2Icon /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
