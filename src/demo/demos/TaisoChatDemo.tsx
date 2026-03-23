import { useState } from 'react'
import { TaisoChat, type ChatMode } from '@/components/taiso/taiso-chat'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function TaisoChatDemo() {
  const [mode, setMode] = useState<ChatMode>('floating')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Current mode:</span>
        <Badge variant="outline">{mode}</Badge>
      </div>

      {/* Floating container */}
      {mode === 'floating' && (
        <div className="relative h-[560px] w-full rounded-lg border border-dashed bg-muted/30">
          <TaisoChat mode={mode} onModeChange={setMode} />
        </div>
      )}

      {/* Docked containers */}
      {(mode === 'docked-left' || mode === 'docked-right') && (
        <div className={`flex h-[560px] w-full rounded-lg border border-dashed bg-muted/30 ${mode === 'docked-right' ? 'flex-row-reverse' : ''}`}>
          <TaisoChat mode={mode} onModeChange={setMode} />
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Main content area
          </div>
        </div>
      )}
    </div>
  )
}
