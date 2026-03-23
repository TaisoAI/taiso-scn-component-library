import { useState } from "react"
import { UserPlusIcon, Trash2Icon, ShieldIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface Permission {
  id: string
  userName: string
  email: string
  initials: string
  role: "viewer" | "executor" | "editor" | "owner"
  grantedAt: string
}

const ROLE_COLORS: Record<Permission["role"], "default" | "secondary" | "outline" | "destructive"> = {
  owner: "default",
  editor: "secondary",
  executor: "outline",
  viewer: "outline",
}

const MOCK_PERMISSIONS: Permission[] = [
  { id: "p1", userName: "Sarah Chen", email: "sarah@taiso.ai", initials: "SC", role: "owner", grantedAt: "Jan 15, 2024" },
  { id: "p2", userName: "James Wilson", email: "james@taiso.ai", initials: "JW", role: "editor", grantedAt: "Feb 3, 2024" },
  { id: "p3", userName: "Maria Garcia", email: "maria@taiso.ai", initials: "MG", role: "executor", grantedAt: "Mar 10, 2024" },
  { id: "p4", userName: "Alex Kim", email: "alex@external.com", initials: "AK", role: "viewer", grantedAt: "Mar 22, 2024" },
]

export function PermissionsEditor({ className }: { className?: string }) {
  const [permissions] = useState(MOCK_PERMISSIONS)

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>Manage who can access this resource</CardDescription>
        <CardAction>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><UserPlusIcon /> Add Collaborator</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Collaborator</DialogTitle>
                <DialogDescription>Invite a user by email address.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="executor">Executor</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        {permissions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><ShieldIcon /></EmptyMedia>
              <EmptyTitle>No collaborators</EmptyTitle>
              <EmptyDescription>Add collaborators to share this resource.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Granted</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm) => (
                <TableRow key={perm.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{perm.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{perm.userName}</div>
                        <div className="text-xs text-muted-foreground">{perm.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {perm.role === "owner" ? (
                      <Badge variant={ROLE_COLORS[perm.role]}>Owner</Badge>
                    ) : (
                      <Select defaultValue={perm.role}>
                        <SelectTrigger className="h-7 w-[110px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="executor">Executor</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{perm.grantedAt}</TableCell>
                  <TableCell>
                    {perm.role !== "owner" && (
                      <Button variant="ghost" size="icon-xs"><Trash2Icon className="text-destructive" /></Button>
                    )}
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
