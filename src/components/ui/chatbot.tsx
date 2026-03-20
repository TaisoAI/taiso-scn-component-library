import * as React from "react"
import { Send, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatbotProps extends React.ComponentProps<"div"> {
  title?: string
  open?: boolean
  onSend?: (message: string) => void
  onClose?: () => void
}

const MOCK_RESPONSES = [
  "I'd be happy to help with that! Could you provide more details?",
  "That's a great question. Let me explain how that works.",
  "Here's what I found — this should point you in the right direction.",
  "I understand. Let me walk you through the steps.",
  "Good point! There are a few ways to approach this.",
  "Thanks for sharing that. Here's my recommendation.",
  "Absolutely! Let me break that down for you.",
  "I see what you mean. Here's what I'd suggest.",
]

const MOCK_SUGGESTIONS = [
  ["Tell me more", "Show an example", "What else?"],
  ["How does this work?", "Can you clarify?", "Next steps"],
  ["That helps, thanks!", "I have another question", "Summarize"],
  ["Go deeper", "Try a different approach", "I'm done"],
]

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function Chatbot({
  title = "Assistant",
  open = true,
  onSend,
  onClose,
  className,
  ...props
}: ChatbotProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = React.useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector("[data-slot='scroll-area-viewport']") as HTMLElement
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight
        }
      }
    })
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isProcessing, scrollToBottom])

  const resizeTextarea = React.useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 144) + "px" // max ~6 lines
  }, [])

  const sendMessage = React.useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isProcessing) return

      const userMsg: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput("")
      onSend?.(trimmed)

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }

      setIsProcessing(true)
      setTimeout(() => {
        const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
        const suggestions = MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)]
        const assistantMsg: ChatMessage = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          suggestions,
        }
        setMessages((prev) => [...prev, assistantMsg])
        setIsProcessing(false)
      }, 2000)
    },
    [isProcessing, onSend]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage(input)
      }
    },
    [input, sendMessage]
  )

  if (!open) return null

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="flex h-full flex-col overflow-hidden bg-secondary py-0" data-slot="chatbot">
        {/* Header */}
        <div className="flex flex-row items-center justify-between border-b bg-card px-4 py-2">
          <div className="flex items-center gap-2">
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
          {onClose && (
            <Button variant="ghost" size="icon-xs" onClick={onClose}>
              <X />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1">
          <div className="flex flex-col gap-3 p-4">
            {messages.length === 0 && (
              <div className="flex flex-1 items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start a conversation!
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[75%] flex-col gap-1",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm shadow-sm break-words",
                      msg.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="px-1 text-[10px] text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          disabled={isProcessing}
                          onClick={() => sendMessage(s)}
                          className="rounded-full border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent disabled:opacity-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

        {/* Composer */}
        <div className="border-t bg-card p-2">
          <div className="flex flex-col rounded-lg border bg-background">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                resizeTextarea()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isProcessing}
              rows={1}
              className="min-h-[1.5rem] max-h-[9rem] flex-1 resize-none border-0 bg-transparent px-3 pt-2.5 pb-1 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <div className="flex items-center justify-between px-1.5 pb-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                className="text-muted-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                <span className="sr-only">Attach</span>
              </Button>
              <Button
                size="icon-sm"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isProcessing}
              >
                <Send />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { Chatbot }
