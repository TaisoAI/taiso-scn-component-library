import { useState } from "react"
import {
  CalendarClockIcon,
  PlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface Schedule {
  id: string
  agentName: string
  cron: string
  humanReadable: string
  timezone: string
  isActive: boolean
  nextRun: string
  lastRun: string | null
  totalRuns: number
}

const MOCK_SCHEDULES: Schedule[] = [
  { id: "sch1", agentName: "Compliance Checker", cron: "0 9 * * 1-5", humanReadable: "Weekdays at 9:00 AM", timezone: "US/Eastern", isActive: true, nextRun: "Mon, Mar 25 at 9:00 AM", lastRun: "Fri, Mar 22 at 9:00 AM", totalRuns: 47 },
  { id: "sch2", agentName: "Research Digest", cron: "0 8 * * 1", humanReadable: "Every Monday at 8:00 AM", timezone: "US/Pacific", isActive: true, nextRun: "Mon, Mar 25 at 8:00 AM", lastRun: "Mon, Mar 18 at 8:00 AM", totalRuns: 12 },
  { id: "sch3", agentName: "Data Validation", cron: "0 */6 * * *", humanReadable: "Every 6 hours", timezone: "UTC", isActive: false, nextRun: "Paused", lastRun: "Mar 20 at 6:00 PM", totalRuns: 230 },
]

export function ScheduleManager({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Schedules</CardTitle>
        <CardDescription>Manage cron-based agent schedules</CardDescription>
        <CardAction>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><PlusIcon /> New Schedule</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Schedule</DialogTitle>
                <DialogDescription>Set up a recurring agent execution.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agent</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance Checker</SelectItem>
                      <SelectItem value="research">Research Digest</SelectItem>
                      <SelectItem value="validation">Data Validation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cron Expression</label>
                    <Input placeholder="0 9 * * 1-5" className="font-mono" />
                    <p className="text-xs text-muted-foreground">minute hour day month weekday</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="us-eastern">US/Eastern</SelectItem>
                        <SelectItem value="us-pacific">US/Pacific</SelectItem>
                        <SelectItem value="europe-london">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Config (JSON)</label>
                  <Textarea
                    className="font-mono text-xs"
                    rows={3}
                    placeholder='{"regulation": "HIPAA"}'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        {MOCK_SCHEDULES.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><CalendarClockIcon /></EmptyMedia>
              <EmptyTitle>No schedules</EmptyTitle>
              <EmptyDescription>Create a schedule to run agents automatically.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Runs</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SCHEDULES.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.agentName}</TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm">{schedule.humanReadable}</span>
                      <div className="text-[10px] font-mono text-muted-foreground">{schedule.cron}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{schedule.timezone}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked={schedule.isActive} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{schedule.nextRun}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{schedule.totalRuns}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs"><MoreHorizontalIcon /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><PencilIcon /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive"><Trash2Icon /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
