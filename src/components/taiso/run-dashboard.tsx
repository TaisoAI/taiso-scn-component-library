import {
  TrendingUpIcon,
  TrendingDownIcon,
  ActivityIcon,
  CheckCircle2Icon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

interface StatCardProps {
  title: string
  value: string
  trend: string
  trendUp: boolean
  icon: React.ReactNode
}

function StatCard({ title, value, trend, trendUp, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {trendUp ? (
            <TrendingUpIcon className="size-3 text-green-500" />
          ) : (
            <TrendingDownIcon className="size-3 text-red-500" />
          )}
          <span className={trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            {trend}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

const CHART_DATA = [
  { day: "Mon", success: 24, failed: 2 },
  { day: "Tue", success: 18, failed: 1 },
  { day: "Wed", success: 31, failed: 3 },
  { day: "Thu", success: 27, failed: 0 },
  { day: "Fri", success: 22, failed: 1 },
  { day: "Sat", success: 8, failed: 0 },
  { day: "Sun", success: 5, failed: 0 },
]

const chartConfig = {
  success: { label: "Success", color: "var(--primary)" },
  failed: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig

const SOP_STATS = [
  { name: "Document Extraction", runs: 128, successRate: "96%", avgDuration: "1m 45s" },
  { name: "Compliance Audit", runs: 87, successRate: "92%", avgDuration: "3m 12s" },
  { name: "Research Summarizer", runs: 54, successRate: "98%", avgDuration: "2m 30s" },
]

export function RunDashboard({ className }: { className?: string }) {
  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Run Analytics</h3>
          <p className="text-sm text-muted-foreground">Execution overview and performance metrics</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Runs"
          value="269"
          trend="+12%"
          trendUp
          icon={<ActivityIcon className="size-4" />}
        />
        <StatCard
          title="Success Rate"
          value="95.2%"
          trend="+2.1%"
          trendUp
          icon={<CheckCircle2Icon className="size-4" />}
        />
        <StatCard
          title="Avg Duration"
          value="2m 15s"
          trend="-8%"
          trendUp
          icon={<ClockIcon className="size-4" />}
        />
        <StatCard
          title="Total Cost"
          value="$47.80"
          trend="+5%"
          trendUp={false}
          icon={<DollarSignIcon className="size-4" />}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Runs This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={CHART_DATA} barGap={2}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="success" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="var(--color-failed)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Per-SOP breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By SOP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SOP_STATS.map((sop) => (
              <div key={sop.name} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">{sop.name}</span>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{sop.runs} runs</span>
                  <Badge variant="outline">{sop.successRate}</Badge>
                  <span>{sop.avgDuration}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
