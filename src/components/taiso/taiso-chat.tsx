import * as React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import {
  Send,
  X,
  GripVerticalIcon,
  PaperclipIcon,
  Maximize2Icon,
  Minimize2Icon,
  PanelLeftIcon,
  PanelRightIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"

// ─── Types ───────────────────────────────────────────────────────────

export type ChatMode = "floating" | "docked-left" | "docked-right"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  suggestions?: string[]
  choices?: ChatChoice
  files?: { name: string; size: string }[]
}

export interface ChatChoice {
  type: "single" | "multi"
  question: string
  options: string[]
  selected?: string[]
  answered?: boolean
}

export interface TaisoChatProps extends React.ComponentProps<"div"> {
  title?: string
  mode?: ChatMode
  onModeChange?: (mode: ChatMode) => void
  onSend?: (message: string, files?: File[]) => void
  onChoiceSelect?: (messageId: string, selected: string[]) => void
  onClose?: () => void
  messages?: ChatMessage[]
  isProcessing?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ─── Choice Component ────────────────────────────────────────────────

function ChoiceSelector({
  choice,
  messageId,
  onSelect,
  disabled,
}: {
  choice: ChatChoice
  messageId: string
  onSelect: (messageId: string, selected: string[]) => void
  disabled: boolean
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(choice.selected ?? [])
  )
  const answered = choice.answered ?? false

  const toggle = (opt: string) => {
    if (answered || disabled) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (choice.type === "single") {
        next.clear()
        next.add(opt)
      } else {
        if (next.has(opt)) next.delete(opt)
        else next.add(opt)
      }
      return next
    })
  }

  const submit = () => {
    if (selected.size === 0) return
    onSelect(messageId, Array.from(selected))
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        {choice.question}
        <Badge variant="outline" className="ml-2 text-[10px]">
          {choice.type === "single" ? "Pick one" : "Pick many"}
        </Badge>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {choice.options.map((opt) => (
          <button
            key={opt}
            disabled={answered || disabled}
            onClick={() => toggle(opt)}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
              selected.has(opt)
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background text-foreground hover:bg-accent",
              (answered || disabled) && "opacity-60 cursor-default"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {!answered && selected.size > 0 && (
        <Button size="xs" onClick={submit} disabled={disabled}>
          Confirm
        </Button>
      )}
    </div>
  )
}

// ─── Message Bubble ──────────────────────────────────────────────────

function MessageBubble({
  msg,
  isProcessing,
  onSuggestion,
  onChoiceSelect,
}: {
  msg: ChatMessage
  isProcessing: boolean
  onSuggestion: (text: string) => void
  onChoiceSelect: (messageId: string, selected: string[]) => void
}) {
  const isUser = msg.role === "user"

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm shadow-sm break-words",
            isUser
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground"
          )}
        >
          {msg.content}
        </div>

        {/* File attachments */}
        {msg.files && msg.files.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {msg.files.map((f) => (
              <Badge key={f.name} variant="outline" className="text-[10px] gap-1">
                <PaperclipIcon className="size-2.5" />
                {f.name} ({f.size})
              </Badge>
            ))}
          </div>
        )}

        {/* Choices */}
        {msg.choices && (
          <ChoiceSelector
            choice={msg.choices}
            messageId={msg.id}
            onSelect={onChoiceSelect}
            disabled={isProcessing}
          />
        )}

        {/* Suggestions */}
        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                disabled={isProcessing}
                onClick={() => onSuggestion(s)}
                className="rounded-full border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <span className="px-1 text-[10px] text-muted-foreground">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  )
}

// ─── Drag Logic (floating mode) ──────────────────────────────────────

function useDraggable(mode: ChatMode, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [pos, setPos] = useState({ x: 40, y: 40 })
  const [size, setSize] = useState({ w: 380, h: 520 })
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null)

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== "floating") return
      e.preventDefault()
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y }

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return
        const dx = ev.clientX - dragRef.current.startX
        const dy = ev.clientY - dragRef.current.startY
        setPos({ x: Math.max(0, dragRef.current.origX + dx), y: Math.max(0, dragRef.current.origY + dy) })
      }
      const onUp = () => {
        dragRef.current = null
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
      }
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [mode, pos]
  )

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== "floating") return
      e.preventDefault()
      e.stopPropagation()
      resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: size.w, origH: size.h }

      const onMove = (ev: MouseEvent) => {
        if (!resizeRef.current) return
        const dx = ev.clientX - resizeRef.current.startX
        const dy = ev.clientY - resizeRef.current.startY
        setSize({
          w: Math.max(320, resizeRef.current.origW + dx),
          h: Math.max(300, resizeRef.current.origH + dy),
        })
      }
      const onUp = () => {
        resizeRef.current = null
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
      }
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [mode, size]
  )

  return { pos, size, onDragStart, onResizeStart }
}

// ─── Mock Data ───────────────────────────────────────────────────────

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: uid(),
    role: "assistant",
    content: "Welcome to Taiso Foundry! I can help you build SOPs and agents. What would you like to create?",
    timestamp: new Date(Date.now() - 60000),
    suggestions: ["Create a new SOP", "Build an agent", "Browse templates"],
  },
  {
    id: uid(),
    role: "user",
    content: "I want to create an SOP that extracts data from PDF invoices and validates the amounts.",
    timestamp: new Date(Date.now() - 45000),
  },
  {
    id: uid(),
    role: "assistant",
    content: "Great! I can help with that. I'll generate a pipeline with PDF extraction and data validation steps. First, let me clarify a few things:",
    timestamp: new Date(Date.now() - 30000),
    choices: {
      type: "single",
      question: "What type of validation do you need?",
      options: [
        "Schema validation (check field types)",
        "Business rules (check amounts match)",
        "Both schema + business rules",
      ],
    },
  },
]

// ─── Main Component ──────────────────────────────────────────────────

export function TaisoChat({
  title = "Taiso Assistant",
  mode: initialMode = "floating",
  onModeChange,
  onSend,
  onChoiceSelect: onChoiceSelectProp,
  onClose,
  messages: controlledMessages,
  isProcessing: controlledProcessing,
  className,
  ...props
}: TaisoChatProps) {
  const [mode, setMode] = useState<ChatMode>(initialMode)
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const [input, setInput] = useState("")
  const [internalProcessing, setInternalProcessing] = useState(false)

  const messages = controlledMessages ?? internalMessages
  const isProcessing = controlledProcessing ?? internalProcessing

  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { pos, size, onDragStart, onResizeStart } = useDraggable(mode, containerRef)

  const changeMode = (newMode: ChatMode) => {
    setMode(newMode)
    onModeChange?.(newMode)
  }

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (!scrollRef.current) return
      const vp = scrollRef.current.querySelector("[data-slot='scroll-area-viewport']") as HTMLElement
      if (vp) vp.scrollTop = vp.scrollHeight
    })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, isProcessing, scrollToBottom])

  // Textarea resize
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 144) + "px"
  }, [])

  // Send message
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isProcessing) return

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      }

      if (!controlledMessages) {
        setInternalMessages((prev) => [...prev, userMsg])
        setInternalProcessing(true)
        // Mock assistant reply
        setTimeout(() => {
          const assistantMsg: ChatMessage = {
            id: uid(),
            role: "assistant",
            content: "I've updated the SOP definition based on your input. You can see the changes in the canvas.",
            timestamp: new Date(),
            suggestions: ["Show me the SOP", "Add another step", "Run a test"],
          }
          setInternalMessages((prev) => [...prev, assistantMsg])
          setInternalProcessing(false)
        }, 1500)
      }

      setInput("")
      if (textareaRef.current) textareaRef.current.style.height = "auto"
      onSend?.(trimmed)
    },
    [isProcessing, onSend, controlledMessages]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage(input)
      }
    },
    [input, sendMessage]
  )

  const handleChoiceSelect = useCallback(
    (messageId: string, selected: string[]) => {
      if (!controlledMessages) {
        setInternalMessages((prev) =>
          prev.map((m) =>
            m.id === messageId && m.choices
              ? { ...m, choices: { ...m.choices, selected, answered: true } }
              : m
          )
        )
        // Mock follow-up
        setInternalProcessing(true)
        setTimeout(() => {
          const reply: ChatMessage = {
            id: uid(),
            role: "assistant",
            content: `Got it — "${selected.join(", ")}". I'll configure the pipeline with that validation approach. Generating the SOP now...`,
            timestamp: new Date(),
          }
          setInternalMessages((prev) => [...prev, reply])
          setInternalProcessing(false)
        }, 1200)
      }
      onChoiceSelectProp?.(messageId, selected)
    },
    [controlledMessages, onChoiceSelectProp]
  )

  // ─── Container styles based on mode ──────────────────────────────

  const containerStyle: React.CSSProperties =
    mode === "floating"
      ? { position: "absolute", left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: 50 }
      : {}

  const containerClasses = cn(
    "flex flex-col",
    mode === "docked-left" && "h-full w-[380px] shrink-0 border-r",
    mode === "docked-right" && "h-full w-[380px] shrink-0 border-l",
    mode === "floating" && "rounded-xl shadow-xl border",
    className
  )

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={containerClasses}
      {...props}
    >
      <Card className="flex h-full flex-col overflow-hidden bg-secondary py-0 rounded-none border-0 shadow-none">
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between border-b bg-card px-3 py-2",
            mode === "floating" && "cursor-grab active:cursor-grabbing"
          )}
          onMouseDown={mode === "floating" ? onDragStart : undefined}
        >
          <div className="flex items-center gap-2">
            {mode === "floating" && (
              <GripVerticalIcon className="size-3.5 text-muted-foreground" />
            )}
            <span className="text-sm font-semibold">{title}</span>
            {isProcessing ? (
              <span className="text-xs text-muted-foreground italic">typing...</span>
            ) : (
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">online</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {/* Mode toggles */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMode("docked-left")}
              className={cn(mode === "docked-left" && "bg-accent")}
              title="Dock left"
            >
              <PanelLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMode("floating")}
              className={cn(mode === "floating" && "bg-accent")}
              title="Float"
            >
              <Maximize2Icon />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMode("docked-right")}
              className={cn(mode === "docked-right" && "bg-accent")}
              title="Dock right"
            >
              <PanelRightIcon />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon-xs" onClick={onClose} title="Close">
                <X />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 min-h-0">
          <div className="flex flex-col gap-3 p-4">
            {messages.length === 0 && (
              <div className="flex flex-1 items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  Start a conversation to build your SOP.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isProcessing={isProcessing}
                onSuggestion={sendMessage}
                onChoiceSelect={handleChoiceSelect}
              />
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <Spinner className="size-4" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Composer — always visible */}
        <div className="shrink-0 border-t bg-card p-2">
          <div className="flex flex-col rounded-lg border bg-background">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                resizeTextarea()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              disabled={isProcessing}
              rows={1}
              className="min-h-[1.5rem] max-h-[9rem] flex-1 resize-none border-0 bg-transparent px-3 pt-2.5 pb-1 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <div className="flex items-center justify-between px-1.5 pb-1.5">
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground" title="Attach file">
                <PaperclipIcon className="size-4" />
              </Button>
              <Button
                size="icon-sm"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isProcessing}
              >
                <Send />
              </Button>
            </div>
          </div>
        </div>

        {/* Resize handle (floating only) */}
        {mode === "floating" && (
          <div
            className="absolute bottom-0 right-0 size-4 cursor-se-resize"
            onMouseDown={onResizeStart}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground/40">
              <path d="M14 14L6 14M14 14L14 6M14 14L10 14M14 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </Card>
    </div>
  )
}
