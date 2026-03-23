import { useState } from "react"
import { KeyIcon, PlusIcon, Trash2Icon, CopyIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface APIKey {
  id: string
  name: string
  maskedKey: string
  scopes: string[]
  createdAt: string
  lastUsed: string | null
}

const MOCK_KEYS: APIKey[] = [
  { id: "k1", name: "Production Backend", maskedKey: "sk_live_...a4F7", scopes: ["read", "write", "execute"], createdAt: "Jan 10, 2024", lastUsed: "2 hours ago" },
  { id: "k2", name: "CI/CD Pipeline", maskedKey: "sk_live_...m2Kp", scopes: ["read", "execute"], createdAt: "Feb 15, 2024", lastUsed: "1 day ago" },
  { id: "k3", name: "Testing", maskedKey: "sk_test_...x9Bw", scopes: ["read"], createdAt: "Mar 1, 2024", lastUsed: null },
]

const SCOPE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  read: "outline",
  write: "secondary",
  execute: "default",
}

export function APIKeyManager({ className }: { className?: string }) {
  const [showNewKey, setShowNewKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const newKeyValue = "sk_live_TaIs0_4bCdEfGhIjKlMnOpQrStUvWx"

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage keys for programmatic access</CardDescription>
        <CardAction>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><PlusIcon /> Create Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>Generate a new key for programmatic access.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="e.g., Production Backend" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scopes</label>
                  <div className="flex gap-2">
                    {["read", "write", "execute"].map((scope) => (
                      <Badge key={scope} variant="outline" className="cursor-pointer hover:bg-accent">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry (optional)</label>
                  <Input type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => setShowNewKey(true)}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {showNewKey && (
          <Alert>
            <KeyIcon />
            <AlertTitle>New API Key Created</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Copy this key now — it won't be shown again.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-2 py-1 text-xs font-mono">{newKeyValue}</code>
                <Button variant="outline" size="icon-xs" onClick={handleCopy}>
                  {copied ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {MOCK_KEYS.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><KeyIcon /></EmptyMedia>
              <EmptyTitle>No API keys</EmptyTitle>
              <EmptyDescription>Create a key to enable programmatic access.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_KEYS.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{key.maskedKey}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {key.scopes.map((s) => (
                        <Badge key={s} variant={SCOPE_VARIANTS[s] ?? "outline"} className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{key.createdAt}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{key.lastUsed ?? "Never"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-xs"><Trash2Icon className="text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
