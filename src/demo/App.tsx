import { useState } from 'react'
import { ThemeProvider, useTheme } from '@/lib/theme-provider'
import { THEME_NAMES, THEME_LABELS } from '@/lib/types'
import type { ThemeName } from '@/lib/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { ButtonDemo } from './demos/ButtonDemo'
import { InputDemo } from './demos/InputDemo'
import { TextareaDemo } from './demos/TextareaDemo'
import { SelectDemo } from './demos/SelectDemo'
import { CheckboxDemo } from './demos/CheckboxDemo'
import { RadioDemo } from './demos/RadioDemo'
import { SwitchDemo } from './demos/SwitchDemo'
import { SliderDemo } from './demos/SliderDemo'
import { ToggleDemo } from './demos/ToggleDemo'
import { CardDemo } from './demos/CardDemo'
import { BadgeDemo } from './demos/BadgeDemo'
import { AvatarDemo } from './demos/AvatarDemo'
import { SeparatorDemo } from './demos/SeparatorDemo'
import { SkeletonDemo } from './demos/SkeletonDemo'
import { ProgressDemo } from './demos/ProgressDemo'
import { AlertDemo } from './demos/AlertDemo'
import { AlertDialogDemo } from './demos/AlertDialogDemo'
import { DialogDemo } from './demos/DialogDemo'
import { SheetDemo } from './demos/SheetDemo'
import { DrawerDemo } from './demos/DrawerDemo'
import { PopoverDemo } from './demos/PopoverDemo'
import { TooltipDemo } from './demos/TooltipDemo'
import { HoverCardDemo } from './demos/HoverCardDemo'
import { DropdownMenuDemo } from './demos/DropdownMenuDemo'
import { ContextMenuDemo } from './demos/ContextMenuDemo'
import { TabsDemo } from './demos/TabsDemo'
import { AccordionDemo } from './demos/AccordionDemo'
import { CollapsibleDemo } from './demos/CollapsibleDemo'
import { TableDemo } from './demos/TableDemo'
import { PaginationDemo } from './demos/PaginationDemo'
import { BreadcrumbDemo } from './demos/BreadcrumbDemo'
import { CommandDemo } from './demos/CommandDemo'
import { CalendarDemo } from './demos/CalendarDemo'
import { InputOTPDemo } from './demos/InputOTPDemo'
import { ScrollAreaDemo } from './demos/ScrollAreaDemo'
import { ResizableDemo } from './demos/ResizableDemo'
import { CarouselDemo } from './demos/CarouselDemo'
import { SpinnerDemo } from './demos/SpinnerDemo'
import { KbdDemo } from './demos/KbdDemo'
import { NativeSelectDemo } from './demos/NativeSelectDemo'
import { ButtonGroupDemo } from './demos/ButtonGroupDemo'
import { ComboboxDemo } from './demos/ComboboxDemo'
import { EmptyDemo } from './demos/EmptyDemo'
import { FieldDemo } from './demos/FieldDemo'
import { InputGroupDemo } from './demos/InputGroupDemo'
import { LoginBlockDemo } from './demos/LoginBlockDemo'
import { FileManagerDemo } from './demos/FileManagerDemo'
import { JobQueuePanelDemo } from './demos/JobQueuePanelDemo'
import { SearchBarDemo } from './demos/SearchBarDemo'
import { ToolPickerDemo } from './demos/ToolPickerDemo'
import { PermissionsEditorDemo } from './demos/PermissionsEditorDemo'
import { APIKeyManagerDemo } from './demos/APIKeyManagerDemo'
import { VersionTimelineDemo } from './demos/VersionTimelineDemo'
import { SOPCatalogBrowserDemo } from './demos/SOPCatalogBrowserDemo'
import { AgentConfiguratorDemo } from './demos/AgentConfiguratorDemo'
import { ScheduleManagerDemo } from './demos/ScheduleManagerDemo'
import { RunDashboardDemo } from './demos/RunDashboardDemo'
import { RunDetailViewDemo } from './demos/RunDetailViewDemo'
import { TaisoChatDemo } from './demos/TaisoChatDemo'
import { SOPCanvasDemo } from './demos/SOPCanvasDemo'

const NAV_SECTIONS = [
  {
    title: 'Inputs',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'button-group', label: 'Button Group' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'combobox', label: 'Combobox' },
      { id: 'field', label: 'Field' },
      { id: 'input', label: 'Input' },
      { id: 'input-group', label: 'Input Group' },
      { id: 'input-otp', label: 'Input OTP' },
      { id: 'native-select', label: 'Native Select' },
      { id: 'radio', label: 'Radio Group' },
      { id: 'select', label: 'Select' },
      { id: 'slider', label: 'Slider' },
      { id: 'switch', label: 'Switch' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'toggle', label: 'Toggle' },
    ],
  },
  {
    title: 'Display',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'card', label: 'Card' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'empty', label: 'Empty State' },
      { id: 'kbd', label: 'Kbd' },
      { id: 'progress', label: 'Progress' },
      { id: 'separator', label: 'Separator' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'table', label: 'Table' },
    ],
  },
  {
    title: 'Overlays',
    items: [
      { id: 'alert-dialog', label: 'Alert Dialog' },
      { id: 'command', label: 'Command' },
      { id: 'context-menu', label: 'Context Menu' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'drawer', label: 'Drawer' },
      { id: 'dropdown-menu', label: 'Dropdown Menu' },
      { id: 'hover-card', label: 'Hover Card' },
      { id: 'popover', label: 'Popover' },
      { id: 'sheet', label: 'Sheet' },
      { id: 'tooltip', label: 'Tooltip' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { id: 'accordion', label: 'Accordion' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'collapsible', label: 'Collapsible' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'tabs', label: 'Tabs' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { id: 'resizable', label: 'Resizable' },
      { id: 'scroll-area', label: 'Scroll Area' },
    ],
  },
  {
    title: 'Blocks',
    items: [
      { id: 'login-block', label: 'Login' },
    ],
  },
  {
    title: 'Taiso Service Components',
    items: [
      { id: 'taiso-chat', label: 'Taiso Chat' },
      { id: 'sop-canvas', label: 'SOP Canvas' },
      { id: 'file-manager', label: 'File Manager' },
      { id: 'job-queue-panel', label: 'Job Queue Panel' },
      { id: 'search-bar', label: 'Search Bar' },
      { id: 'tool-picker', label: 'Tool Picker' },
      { id: 'permissions-editor', label: 'Permissions Editor' },
      { id: 'api-key-manager', label: 'API Key Manager' },
      { id: 'version-timeline', label: 'Version Timeline' },
      { id: 'sop-catalog-browser', label: 'SOP Catalog Browser' },
      { id: 'agent-configurator', label: 'Agent Configurator' },
      { id: 'schedule-manager', label: 'Schedule Manager' },
      { id: 'run-dashboard', label: 'Run Dashboard' },
      { id: 'run-detail-view', label: 'Run Detail View' },
    ],
  },
]

const DEMO_COMPONENTS: Record<string, React.FC> = {
  button: ButtonDemo,
  input: InputDemo,
  textarea: TextareaDemo,
  select: SelectDemo,
  checkbox: CheckboxDemo,
  radio: RadioDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  toggle: ToggleDemo,
  card: CardDemo,
  badge: BadgeDemo,
  avatar: AvatarDemo,
  separator: SeparatorDemo,
  skeleton: SkeletonDemo,
  progress: ProgressDemo,
  alert: AlertDemo,
  'alert-dialog': AlertDialogDemo,
  dialog: DialogDemo,
  sheet: SheetDemo,
  drawer: DrawerDemo,
  popover: PopoverDemo,
  tooltip: TooltipDemo,
  'hover-card': HoverCardDemo,
  'dropdown-menu': DropdownMenuDemo,
  'context-menu': ContextMenuDemo,
  tabs: TabsDemo,
  accordion: AccordionDemo,
  collapsible: CollapsibleDemo,
  table: TableDemo,
  pagination: PaginationDemo,
  breadcrumb: BreadcrumbDemo,
  command: CommandDemo,
  calendar: CalendarDemo,
  'input-otp': InputOTPDemo,
  'scroll-area': ScrollAreaDemo,
  resizable: ResizableDemo,
  carousel: CarouselDemo,
  spinner: SpinnerDemo,
  kbd: KbdDemo,
  'native-select': NativeSelectDemo,
  'button-group': ButtonGroupDemo,
  combobox: ComboboxDemo,
  empty: EmptyDemo,
  field: FieldDemo,
  'input-group': InputGroupDemo,
  'login-block': LoginBlockDemo,
  'taiso-chat': TaisoChatDemo,
  'sop-canvas': SOPCanvasDemo,
  'file-manager': FileManagerDemo,
  'job-queue-panel': JobQueuePanelDemo,
  'search-bar': SearchBarDemo,
  'tool-picker': ToolPickerDemo,
  'permissions-editor': PermissionsEditorDemo,
  'api-key-manager': APIKeyManagerDemo,
  'version-timeline': VersionTimelineDemo,
  'sop-catalog-browser': SOPCatalogBrowserDemo,
  'agent-configurator': AgentConfiguratorDemo,
  'schedule-manager': ScheduleManagerDemo,
  'run-dashboard': RunDashboardDemo,
  'run-detail-view': RunDetailViewDemo,
}

function ThemeBar() {
  const { theme, mode, setTheme, toggleMode } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Select value={theme} onValueChange={(v) => setTheme(v as ThemeName)}>
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEME_NAMES.map((t) => (
            <SelectItem key={t} value={t} className="text-xs">
              {THEME_LABELS[t as ThemeName]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <button
        onClick={toggleMode}
        className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {mode === 'light' ? '☀ Light' : '☾ Dark'}
      </button>
    </div>
  )
}

function SidebarNav({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    'block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                    activeId === item.id
                      ? 'bg-accent font-medium text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

function DemoContent({ activeId }: { activeId: string }) {
  const Component = DEMO_COMPONENTS[activeId]
  const label = NAV_SECTIONS.flatMap(s => s.items).find(i => i.id === activeId)?.label ?? activeId

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl space-y-8 p-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Interactive preview of the {label} component.
          </p>
        </div>
        <Separator />
        {Component ? <Component /> : <p className="text-muted-foreground">No demo available.</p>}
      </div>
    </ScrollArea>
  )
}

function AppShell() {
  const [activeId, setActiveId] = useState('button')

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <div className="hidden w-56 shrink-0 border-r md:block">
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            shadcn Themes
          </span>
        </div>
        <div className="h-[calc(100vh-3.5rem)]">
          <SidebarNav activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-6">
          {/* Mobile: dropdown */}
          <select
            className="rounded-md border bg-background px-2 py-1 text-sm md:hidden"
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
          >
            {NAV_SECTIONS.map((section) => (
              <optgroup key={section.title} label={section.title}>
                {section.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="hidden md:block" />
          <ThemeBar />
        </header>
        <div className="flex-1 overflow-hidden">
          <DemoContent activeId={activeId} />
        </div>
      </div>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </ThemeProvider>
  )
}
