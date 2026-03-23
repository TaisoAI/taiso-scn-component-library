import * as React from "react"
import {
  useState,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react"
import {
  ZoomInIcon,
  ZoomOutIcon,
  MaximizeIcon,
  PlusIcon,
  Undo2Icon,
  Redo2Icon,
  LayoutGridIcon,
  Trash2Icon,
  StarIcon,
  WrenchIcon,
  FileTextIcon,
  UserIcon,
  DiamondIcon,
  BoxIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

export type StepType = "llm" | "tool" | "sop" | "agent" | "conditional"

export interface NodeData {
  id: string
  type: StepType
  name: string
  description: string
  input?: string
  output?: string
  model?: string
}

export interface CanvasNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  data: NodeData
}

export interface CanvasEdge {
  id: string
  source: string
  target: string
  sourcePort?: string
  targetPort?: string
}

// ═══════════════════════════════════════════════════════════════════════
// STEP TYPE CONFIG
// ═══════════════════════════════════════════════════════════════════════

const STEP_TYPES: Record<
  StepType,
  { color: string; label: string; icon: React.ReactNode }
> = {
  llm: { color: "#8b5cf6", label: "LLM", icon: <StarIcon className="size-3.5" /> },
  tool: { color: "#f59e0b", label: "Tool", icon: <WrenchIcon className="size-3.5" /> },
  sop: { color: "#10b981", label: "SOP", icon: <FileTextIcon className="size-3.5" /> },
  agent: { color: "#3b82f6", label: "Agent", icon: <UserIcon className="size-3.5" /> },
  conditional: { color: "#ef4444", label: "Conditional", icon: <DiamondIcon className="size-3.5" /> },
}

// ═══════════════════════════════════════════════════════════════════════
// CANVAS STATE REDUCER
// ═══════════════════════════════════════════════════════════════════════

interface CanvasState {
  nodes: Map<string, CanvasNode>
  edges: Map<string, CanvasEdge>
  selection: Set<string>
  undoStack: Array<{ nodes: Map<string, CanvasNode>; edges: Map<string, CanvasEdge> }>
  redoStack: Array<{ nodes: Map<string, CanvasNode>; edges: Map<string, CanvasEdge> }>
}

type CanvasAction =
  | { type: "INIT"; nodes: Map<string, CanvasNode>; edges: Map<string, CanvasEdge> }
  | { type: "MOVE_NODES"; moves: Array<{ id: string; x: number; y: number }> }
  | { type: "ADD_NODE"; node: CanvasNode }
  | { type: "DELETE_SELECTED" }
  | { type: "ADD_EDGE"; edge: CanvasEdge }
  | { type: "UPDATE_EDGE"; edgeId: string; updates: Partial<CanvasEdge> }
  | { type: "DELETE_EDGES"; edgeIds: string[] }
  | { type: "SET_SELECTION"; ids: string[] }
  | { type: "TOGGLE_SELECTION"; id: string }
  | { type: "CLEAR_SELECTION" }
  | { type: "UNDO" }
  | { type: "REDO" }

function cloneMap<T>(m: Map<string, T>): Map<string, T> {
  const c = new Map<string, T>()
  for (const [k, v] of m) c.set(k, { ...v } as T)
  return c
}

function pushHistory(state: CanvasState) {
  const snapshot = { nodes: cloneMap(state.nodes), edges: cloneMap(state.edges) }
  return { undoStack: [...state.undoStack, snapshot].slice(-50), redoStack: [] as CanvasState["redoStack"] }
}

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case "INIT":
      return { ...state, nodes: action.nodes, edges: action.edges, selection: new Set(), undoStack: [], redoStack: [] }

    case "MOVE_NODES": {
      const h = pushHistory(state)
      const nodes = cloneMap(state.nodes)
      for (const { id, x, y } of action.moves) {
        const n = nodes.get(id)
        if (n) { n.x = x; n.y = y }
      }
      return { ...state, nodes, ...h }
    }

    case "ADD_NODE": {
      const h = pushHistory(state)
      const nodes = cloneMap(state.nodes)
      nodes.set(action.node.id, action.node)
      return { ...state, nodes, selection: new Set([action.node.id]), ...h }
    }

    case "DELETE_SELECTED": {
      if (state.selection.size === 0) return state
      const h = pushHistory(state)
      const nodes = cloneMap(state.nodes)
      const edges = cloneMap(state.edges)
      for (const id of state.selection) { nodes.delete(id); edges.delete(id) }
      for (const [eid, edge] of edges) {
        if (state.selection.has(edge.source) || state.selection.has(edge.target)) edges.delete(eid)
      }
      return { ...state, nodes, edges, selection: new Set(), ...h }
    }

    case "ADD_EDGE": {
      if (action.edge.source === action.edge.target) return state
      for (const e of state.edges.values()) {
        if (e.source === action.edge.source && e.target === action.edge.target) return state
      }
      const h = pushHistory(state)
      const edges = cloneMap(state.edges)
      edges.set(action.edge.id, action.edge)
      return { ...state, edges, ...h }
    }

    case "UPDATE_EDGE": {
      const h = pushHistory(state)
      const edges = cloneMap(state.edges)
      const edge = edges.get(action.edgeId)
      if (edge) {
        Object.assign(edge, action.updates)
        // If source or target changed, update the edge ID for uniqueness
      }
      return { ...state, edges, ...h }
    }

    case "DELETE_EDGES": {
      const h = pushHistory(state)
      const edges = cloneMap(state.edges)
      const sel = new Set(state.selection)
      for (const id of action.edgeIds) { edges.delete(id); sel.delete(id) }
      return { ...state, edges, selection: sel, ...h }
    }

    case "SET_SELECTION":
      return { ...state, selection: new Set(action.ids) }
    case "TOGGLE_SELECTION": {
      const s = new Set(state.selection)
      s.has(action.id) ? s.delete(action.id) : s.add(action.id)
      return { ...state, selection: s }
    }
    case "CLEAR_SELECTION":
      return { ...state, selection: new Set() }

    case "UNDO": {
      if (state.undoStack.length === 0) return state
      const stack = [...state.undoStack]
      const snap = stack.pop()!
      return { ...state, nodes: snap.nodes, edges: snap.edges, undoStack: stack, redoStack: [...state.redoStack, { nodes: cloneMap(state.nodes), edges: cloneMap(state.edges) }], selection: new Set() }
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state
      const stack = [...state.redoStack]
      const snap = stack.pop()!
      return { ...state, nodes: snap.nodes, edges: snap.edges, redoStack: stack, undoStack: [...state.undoStack, { nodes: cloneMap(state.nodes), edges: cloneMap(state.edges) }], selection: new Set() }
    }

    default:
      return state
  }
}

const initialState: CanvasState = { nodes: new Map(), edges: new Map(), selection: new Set(), undoStack: [], redoStack: [] }

// ═══════════════════════════════════════════════════════════════════════
// ORTHOGONAL ROUTER — FIX: proper line + arrowhead
// ═══════════════════════════════════════════════════════════════════════

function getPortPos(node: CanvasNode, port: string) {
  switch (port) {
    case "left":   return { x: node.x, y: node.y + node.height / 2 }
    case "right":  return { x: node.x + node.width, y: node.y + node.height / 2 }
    case "top":    return { x: node.x + node.width / 2, y: node.y }
    case "bottom": return { x: node.x + node.width / 2, y: node.y + node.height }
    default:       return { x: node.x + node.width, y: node.y + node.height / 2 }
  }
}

const STUB = 30

function stubPoint(pt: { x: number; y: number }, port: string) {
  switch (port) {
    case "right":  return { x: pt.x + STUB, y: pt.y }
    case "left":   return { x: pt.x - STUB, y: pt.y }
    case "bottom": return { x: pt.x, y: pt.y + STUB }
    case "top":    return { x: pt.x, y: pt.y - STUB }
    default:       return { x: pt.x + STUB, y: pt.y }
  }
}

function isHPort(p: string) { return p === "left" || p === "right" }

function routeOrthogonal(src: CanvasNode, tgt: CanvasNode, srcPort = "right", tgtPort = "left") {
  const start = getPortPos(src, srcPort)
  const end = getPortPos(tgt, tgtPort)

  // Classic right → left
  if (srcPort === "right" && tgtPort === "left") {
    const midX = (start.x + end.x) / 2
    if (end.x > start.x + 40) {
      if (Math.abs(start.y - end.y) < 1) return [start, end]
      return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end]
    }
    const detour = 40
    const yOff = end.y > start.y ? 80 : -80
    return [start, { x: start.x + detour, y: start.y }, { x: start.x + detour, y: start.y + yOff }, { x: end.x - detour, y: start.y + yOff }, { x: end.x - detour, y: end.y }, end]
  }

  // General port-aware routing
  const s = stubPoint(start, srcPort)
  const e = stubPoint(end, tgtPort)
  const srcH = isHPort(srcPort)
  const tgtH = isHPort(tgtPort)

  if (srcH && tgtH) {
    if (Math.abs(s.y - e.y) < 1) return [start, s, e, end]
    const mx = (s.x + e.x) / 2
    return [start, s, { x: mx, y: s.y }, { x: mx, y: e.y }, e, end]
  }
  if (!srcH && !tgtH) {
    if (Math.abs(s.x - e.x) < 1) return [start, s, e, end]
    const my = (s.y + e.y) / 2
    return [start, s, { x: s.x, y: my }, { x: e.x, y: my }, e, end]
  }
  if (srcH) return [start, s, { x: e.x, y: s.y }, e, end]
  return [start, s, { x: s.x, y: e.y }, e, end]
}

function pointsToPath(points: Array<{ x: number; y: number }>, cornerRadius = 8) {
  if (points.length < 2) return ""
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1], curr = points[i], next = points[i + 1]
    const dx1 = curr.x - prev.x, dy1 = curr.y - prev.y
    const dx2 = next.x - curr.x, dy2 = next.y - curr.y
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
    const r = Math.min(cornerRadius, len1 / 2, len2 / 2)
    if (r < 1) { d += ` L ${curr.x} ${curr.y}`; continue }
    const sx = curr.x - (dx1 / len1) * r, sy = curr.y - (dy1 / len1) * r
    const ex = curr.x + (dx2 / len2) * r, ey = curr.y + (dy2 / len2) * r
    d += ` L ${sx} ${sy} Q ${curr.x} ${curr.y} ${ex} ${ey}`
  }
  const last = points[points.length - 1]
  d += ` L ${last.x} ${last.y}`
  return d
}

// ═══════════════════════════════════════════════════════════════════════
// AUTO LAYOUT
// ═══════════════════════════════════════════════════════════════════════

const NODE_W = 260
const NODE_H = 100
const GAP_X = 120
const GAP_Y = 60
const GRID = 20

function snap(v: number) { return Math.round(v / GRID) * GRID }

function autoLayout(nodes: Map<string, CanvasNode>, edges: Map<string, CanvasEdge>) {
  const ids = Array.from(nodes.keys())
  if (ids.length === 0) return

  const inDeg = new Map<string, number>()
  const out = new Map<string, string[]>()
  for (const id of ids) { inDeg.set(id, 0); out.set(id, []) }
  for (const e of edges.values()) {
    if (nodes.has(e.source) && nodes.has(e.target)) {
      inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1)
      out.get(e.source)!.push(e.target)
    }
  }

  const queue: string[] = []
  const layer = new Map<string, number>()
  for (const [id, deg] of inDeg) {
    if (deg === 0) { queue.push(id); layer.set(id, 0) }
  }

  while (queue.length) {
    const cur = queue.shift()!
    const cl = layer.get(cur)!
    for (const nxt of out.get(cur)!) {
      layer.set(nxt, Math.max(layer.get(nxt) ?? 0, cl + 1))
      const nd = inDeg.get(nxt)! - 1
      inDeg.set(nxt, nd)
      if (nd === 0) queue.push(nxt)
    }
  }

  let maxL = 0
  for (const l of layer.values()) maxL = Math.max(maxL, l)
  for (const id of ids) {
    if (!layer.has(id)) { maxL++; layer.set(id, maxL) }
  }

  const layers = new Map<number, string[]>()
  for (const [id, l] of layer) {
    if (!layers.has(l)) layers.set(l, [])
    layers.get(l)!.push(id)
  }

  for (const [l, nodeIds] of layers) {
    const totalH = nodeIds.length * NODE_H + (nodeIds.length - 1) * GAP_Y
    const startY = -totalH / 2
    for (let i = 0; i < nodeIds.length; i++) {
      const n = nodes.get(nodeIds[i])!
      n.x = snap(l * (NODE_W + GAP_X))
      n.y = snap(startY + i * (NODE_H + GAP_Y))
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════

function createMockGraph() {
  const steps: NodeData[] = [
    { id: "step-1", type: "tool", name: "Extract PDF", description: "Extract text and tables from PDF invoice", input: "{{inputs.file}}", output: "extracted_text" },
    { id: "step-2", type: "llm", name: "Parse Invoice", description: "Parse extracted text into structured invoice data", input: "{{steps.step-1.output}}", output: "invoice_data", model: "gpt-4-turbo" },
    { id: "step-3", type: "conditional", name: "Check Amount", description: "Verify total matches line items sum", input: "{{steps.step-2.output}}", output: "validation_result" },
    { id: "step-4", type: "llm", name: "Generate Report", description: "Create final validation report with findings", input: "{{steps.step-3.output}}", output: "report", model: "gpt-4-turbo" },
    { id: "step-5", type: "tool", name: "Save Output", description: "Write report to project files", input: "{{steps.step-4.output}}", output: "file_id" },
  ]

  const nodes = new Map<string, CanvasNode>()
  const edges = new Map<string, CanvasEdge>()

  for (const s of steps) nodes.set(s.id, { id: s.id, x: 0, y: 0, width: NODE_W, height: NODE_H, data: s })
  const ids = Array.from(nodes.keys())
  for (let i = 0; i < ids.length - 1; i++) {
    const eid = `edge-${ids[i]}-${ids[i + 1]}`
    edges.set(eid, { id: eid, source: ids[i], target: ids[i + 1] })
  }

  autoLayout(nodes, edges)
  return { nodes, edges }
}

// ═══════════════════════════════════════════════════════════════════════
// FLOW NODE
// ═══════════════════════════════════════════════════════════════════════

type PortName = "left" | "right" | "top" | "bottom"

const PORT_POSITIONS: Record<PortName, string> = {
  left: "absolute top-1/2 -left-[6px] -translate-y-1/2",
  right: "absolute top-1/2 -right-[6px] -translate-y-1/2",
  top: "absolute left-1/2 -top-[6px] -translate-x-1/2",
  bottom: "absolute left-1/2 -bottom-[6px] -translate-x-1/2",
}

const FlowNode = React.memo(function FlowNode({
  node, selected, onMouseDown, onPortMouseDown,
}: {
  node: CanvasNode; selected: boolean
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void
  onPortMouseDown: (e: React.MouseEvent, nodeId: string, port: PortName) => void
}) {
  const config = STEP_TYPES[node.data.type] ?? { color: "#6b7280", label: "Step", icon: <BoxIcon className="size-3.5" /> }

  return (
    <div
      className={cn(
        "absolute select-none rounded-lg border bg-card shadow-md transition-shadow cursor-grab active:cursor-grabbing group/node",
        selected && "ring-2 ring-primary shadow-lg"
      )}
      style={{ left: node.x, top: node.y, width: NODE_W, minHeight: NODE_H }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      <div className="flex items-center gap-2 rounded-t-lg px-3 py-2" style={{ backgroundColor: config.color + "18" }}>
        <div className="flex size-6 items-center justify-center rounded-md text-white" style={{ backgroundColor: config.color }}>
          {config.icon}
        </div>
        <span className="text-xs font-semibold truncate" style={{ color: config.color }}>{config.label}</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <div className="text-sm font-medium truncate">{node.data.name}</div>
        <div className="text-xs text-muted-foreground line-clamp-2">{node.data.description}</div>
        {node.data.model && <Badge variant="outline" className="text-[10px] mt-1">{node.data.model}</Badge>}
      </div>
      {/* Connection ports: left/top = input, right/bottom = output */}
      {(["left", "right", "top", "bottom"] as PortName[]).map((port) => {
        const portType = (port === "right" || port === "bottom") ? "output" : "input"
        return (
          <div
            key={port}
            data-port={port}
            data-port-type={portType}
            data-node-id={node.id}
            className={cn(
              PORT_POSITIONS[port],
              "size-3 rounded-full border-2 border-border bg-background",
              portType === "output" ? "cursor-crosshair" : "cursor-pointer",
              "hover:border-primary hover:bg-primary/20 hover:scale-150 transition-all",
              "opacity-0 group-hover/node:opacity-100",
              selected && "opacity-100"
            )}
            onMouseDown={(e) => {
              e.stopPropagation()
              // Only start connection drag from output ports
              if (portType === "output") {
                onPortMouseDown(e, node.id, port)
              }
            }}
          />
        )
      })}
    </div>
  )
})

// ═══════════════════════════════════════════════════════════════════════
// CONNECTOR — FIX: visible line + arrowhead
// ═══════════════════════════════════════════════════════════════════════

const Connector = React.memo(function Connector({
  edge, nodes, selected, onClick, onHandleDrag,
}: {
  edge: CanvasEdge; nodes: Map<string, CanvasNode>; selected: boolean
  onClick: (e: React.MouseEvent, edgeId: string) => void
  onHandleDrag: (e: React.MouseEvent, edgeId: string, handle: "source" | "target") => void
}) {
  const src = nodes.get(edge.source)
  const tgt = nodes.get(edge.target)
  if (!src || !tgt) return null

  const srcPort = edge.sourcePort ?? "right"
  const tgtPort = edge.targetPort ?? "left"
  const points = routeOrthogonal(src, tgt, srcPort, tgtPort)
  const d = pointsToPath(points, 8)

  const startPt = points[0]
  const endPt = points[points.length - 1]

  return (
    <g style={{ pointerEvents: "auto" }}>
      {/* Wide transparent hit area */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: "pointer" }}
        onClick={(e) => { e.stopPropagation(); onClick(e, edge.id) }}
      />
      {/* Visible connector line */}
      <path
        d={d}
        fill="none"
        stroke={selected ? "#3b82f6" : "#94a3b8"}
        strokeWidth={selected ? 2.5 : 2}
        markerEnd={selected ? "url(#arrowhead-active)" : "url(#arrowhead)"}
        style={{ pointerEvents: "none", transition: "stroke 0.15s" }}
      />
      {/* Drag handles when selected */}
      {selected && (
        <>
          <circle
            cx={startPt.x}
            cy={startPt.y}
            r={6}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2}
            style={{ cursor: "grab" }}
            onMouseDown={(e) => { e.stopPropagation(); onHandleDrag(e, edge.id, "source") }}
          />
          <circle
            cx={endPt.x}
            cy={endPt.y}
            r={6}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2}
            style={{ cursor: "grab" }}
            onMouseDown={(e) => { e.stopPropagation(); onHandleDrag(e, edge.id, "target") }}
          />
        </>
      )}
    </g>
  )
})

// ═══════════════════════════════════════════════════════════════════════
// MINIMAP — FIX: visible viewport rect + draggable
// ═══════════════════════════════════════════════════════════════════════

function Minimap({
  nodes, viewport, containerRect, onViewportDrag,
}: {
  nodes: Map<string, CanvasNode>
  viewport: { panX: number; panY: number; zoom: number }
  containerRect: { width: number; height: number }
  onViewportDrag: (panX: number, panY: number) => void
}) {
  const MINIMAP_W = 180
  const MINIMAP_H = 110
  const dragRef = useRef<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null)

  const nodeArr = Array.from(nodes.values())
  if (nodeArr.length === 0) return null

  // Compute content bounds including viewport
  const vpCanvasX = -viewport.panX / viewport.zoom
  const vpCanvasY = -viewport.panY / viewport.zoom
  const vpCanvasW = containerRect.width / viewport.zoom
  const vpCanvasH = containerRect.height / viewport.zoom

  let minX = Math.min(vpCanvasX, ...nodeArr.map((n) => n.x))
  let minY = Math.min(vpCanvasY, ...nodeArr.map((n) => n.y))
  let maxX = Math.max(vpCanvasX + vpCanvasW, ...nodeArr.map((n) => n.x + n.width))
  let maxY = Math.max(vpCanvasY + vpCanvasH, ...nodeArr.map((n) => n.y + n.height))

  const pad = 80
  minX -= pad; minY -= pad; maxX += pad; maxY += pad
  const contentW = maxX - minX
  const contentH = maxY - minY
  const scale = Math.min(MINIMAP_W / contentW, MINIMAP_H / contentH)

  const vpRectX = (vpCanvasX - minX) * scale
  const vpRectY = (vpCanvasY - minY) * scale
  const vpRectW = vpCanvasW * scale
  const vpRectH = vpCanvasH * scale

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { startX: e.clientX, startY: e.clientY, origPanX: viewport.panX, origPanY: viewport.panY }

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      // Convert minimap pixels to canvas pixels
      const canvasDX = (dx / scale) * viewport.zoom
      const canvasDY = (dy / scale) * viewport.zoom
      onViewportDrag(dragRef.current.origPanX - canvasDX, dragRef.current.origPanY - canvasDY)
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div className="absolute bottom-3 right-3 rounded-lg border bg-card/95 p-1.5 shadow-md backdrop-blur-sm">
      <svg width={MINIMAP_W} height={MINIMAP_H} className="rounded">
        {/* Nodes */}
        {nodeArr.map((n) => {
          const config = STEP_TYPES[n.data.type]
          return (
            <rect
              key={n.id}
              x={(n.x - minX) * scale}
              y={(n.y - minY) * scale}
              width={Math.max(n.width * scale, 2)}
              height={Math.max(n.height * scale, 2)}
              rx={1.5}
              fill={config?.color ?? "#6b7280"}
              opacity={0.7}
            />
          )
        })}
        {/* Viewport rectangle — draggable */}
        <rect
          x={vpRectX}
          y={vpRectY}
          width={Math.max(vpRectW, 4)}
          height={Math.max(vpRectH, 4)}
          fill="var(--primary)"
          fillOpacity={0.08}
          stroke="var(--primary)"
          strokeWidth={2}
          rx={2}
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        />
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// LASSO SELECTION OVERLAY
// ═══════════════════════════════════════════════════════════════════════

function LassoOverlay({ rect }: { rect: { x: number; y: number; w: number; h: number } | null }) {
  if (!rect) return null
  const x = rect.w >= 0 ? rect.x : rect.x + rect.w
  const y = rect.h >= 0 ? rect.y : rect.y + rect.h
  const w = Math.abs(rect.w)
  const h = Math.abs(rect.h)
  return (
    <div
      className="absolute border-2 border-primary/60 bg-primary/10 rounded-sm pointer-events-none"
      style={{ left: x, top: y, width: w, height: h, zIndex: 40 }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// TOOLBAR
// ═══════════════════════════════════════════════════════════════════════

function Toolbar({
  zoom, onZoomIn, onZoomOut, onFitToView, onAutoLayout, onUndo, onRedo, onDeleteSelected, onAddNode, canUndo, canRedo, hasSelection,
}: {
  zoom: number; onZoomIn: () => void; onZoomOut: () => void; onFitToView: () => void; onAutoLayout: () => void
  onUndo: () => void; onRedo: () => void; onDeleteSelected: () => void; onAddNode: (type: StepType) => void
  canUndo: boolean; canRedo: boolean; hasSelection: boolean
}) {
  return (
    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg border bg-card/90 p-1 shadow-sm backdrop-blur-sm z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="xs" className="gap-1"><PlusIcon /> Add Node</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {(Object.entries(STEP_TYPES) as [StepType, typeof STEP_TYPES[StepType]][]).map(([type, cfg]) => (
            <DropdownMenuItem key={type} onClick={() => onAddNode(type)}>
              <span style={{ color: cfg.color }}>{cfg.icon}</span> {cfg.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="mx-0.5 h-5 w-px bg-border" />
      <Button variant="ghost" size="icon-xs" onClick={onUndo} disabled={!canUndo} title="Undo"><Undo2Icon /></Button>
      <Button variant="ghost" size="icon-xs" onClick={onRedo} disabled={!canRedo} title="Redo"><Redo2Icon /></Button>
      {hasSelection && <Button variant="ghost" size="icon-xs" onClick={onDeleteSelected} title="Delete"><Trash2Icon className="text-destructive" /></Button>}
      <div className="mx-0.5 h-5 w-px bg-border" />
      <Button variant="ghost" size="icon-xs" onClick={onZoomOut} title="Zoom out"><ZoomOutIcon /></Button>
      <span className="w-10 text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
      <Button variant="ghost" size="icon-xs" onClick={onZoomIn} title="Zoom in"><ZoomInIcon /></Button>
      <Button variant="ghost" size="icon-xs" onClick={onFitToView} title="Fit to view"><MaximizeIcon /></Button>
      <div className="mx-0.5 h-5 w-px bg-border" />
      <Button variant="ghost" size="icon-xs" onClick={onAutoLayout} title="Auto layout"><LayoutGridIcon /></Button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// GRID BACKGROUND
// ═══════════════════════════════════════════════════════════════════════

function GridBackground({ zoom }: { zoom: number }) {
  const g = GRID * zoom
  return (
    <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
      <defs>
        <pattern id="canvas-grid" width={g} height={g} patternUnits="userSpaceOnUse">
          <circle cx={g / 2} cy={g / 2} r={0.5} fill="var(--border)" opacity={0.4} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#canvas-grid)" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// AUTO-PAN CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const AUTO_PAN_ZONE = 60 // px from edge
const AUTO_PAN_SPEED = 10 // px per frame

// ═══════════════════════════════════════════════════════════════════════
// MAIN SOP CANVAS
// ═══════════════════════════════════════════════════════════════════════

export interface SOPCanvasProps extends React.ComponentProps<"div"> {
  initialNodes?: Map<string, CanvasNode>
  initialEdges?: Map<string, CanvasEdge>
  onNodesChange?: (nodes: Map<string, CanvasNode>) => void
  onEdgesChange?: (edges: Map<string, CanvasEdge>) => void
}

export function SOPCanvas({ initialNodes, initialEdges, onNodesChange, onEdgesChange, className, ...props }: SOPCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState({ width: 800, height: 600 })

  const [state, dispatch] = useReducer(canvasReducer, initialState)
  const { nodes, edges, selection, undoStack, redoStack } = state

  const [viewport, setViewport] = useState({ panX: 0, panY: 0, zoom: 1 })
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const spaceRef = useRef(false)

  // Drag state — supports multi-node drag
  const dragRef = useRef<{
    startX: number; startY: number
    origPositions: Map<string, { x: number; y: number }>
  } | null>(null)

  // Lasso state
  const [lasso, setLasso] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const lassoStart = useRef<{ screenX: number; screenY: number } | null>(null)

  // Connection drag state (port-to-port edge creation OR edge handle re-routing)
  const connDragRef = useRef<{
    sourceNodeId: string
    sourcePort: PortName
    startCanvasX: number
    startCanvasY: number
    // For edge handle re-routing:
    edgeId?: string
    handle?: "source" | "target"
  } | null>(null)
  const [connPreview, setConnPreview] = useState<{ sx: number; sy: number; ex: number; ey: number } | null>(null)

  // Auto-pan during drag
  const autoPanRef = useRef<number | null>(null)
  const mouseScreenRef = useRef({ x: 0, y: 0 })

  // Initialize
  useEffect(() => {
    if (initialNodes && initialEdges) {
      dispatch({ type: "INIT", nodes: initialNodes, edges: initialEdges })
    } else {
      const mock = createMockGraph()
      dispatch({ type: "INIT", nodes: mock.nodes, edges: mock.edges })
    }
  }, [initialNodes, initialEdges])

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerRect({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const clampZoom = (z: number) => Math.min(3, Math.max(0.1, z))

  const fitToView = useCallback(() => {
    if (nodes.size === 0) return
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const n of nodes.values()) {
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y)
      maxX = Math.max(maxX, n.x + n.width); maxY = Math.max(maxY, n.y + n.height)
    }
    const pad = 80
    const cw = maxX - minX
    const ch = maxY - minY
    const z = clampZoom(Math.min((containerRect.width - pad * 2) / cw, (containerRect.height - pad * 2) / ch, 1.5))
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    setViewport({ panX: containerRect.width / 2 - cx * z, panY: containerRect.height / 2 - cy * z, zoom: z })
  }, [nodes, containerRect])

  // Fit to view on init
  useEffect(() => {
    if (nodes.size > 0 && containerRect.width > 100) fitToView()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.size > 0 ? 1 : 0, containerRect.width > 100 ? 1 : 0])

  // FIX: Zoom in/out from center of canvas
  const zoomIn = useCallback(() => {
    setViewport((v) => {
      const z = clampZoom(v.zoom + 0.1)
      const r = z / v.zoom
      const cx = containerRect.width / 2
      const cy = containerRect.height / 2
      return { panX: cx - (cx - v.panX) * r, panY: cy - (cy - v.panY) * r, zoom: z }
    })
  }, [containerRect])

  const zoomOut = useCallback(() => {
    setViewport((v) => {
      const z = clampZoom(v.zoom - 0.1)
      const r = z / v.zoom
      const cx = containerRect.width / 2
      const cy = containerRect.height / 2
      return { panX: cx - (cx - v.panX) * r, panY: cy - (cy - v.panY) * r, zoom: z }
    })
  }, [containerRect])

  // Wheel zoom/pan
  const onWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      setViewport((v) => {
        const z = clampZoom(v.zoom * (1 - e.deltaY * 0.001))
        const r = z / v.zoom
        return { panX: cx - (cx - v.panX) * r, panY: cy - (cy - v.panY) * r, zoom: z }
      })
    } else {
      setViewport((v) => ({ ...v, panX: v.panX - e.deltaX, panY: v.panY - e.deltaY }))
    }
  }, [])

  // Screen to canvas coords
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (screenX - rect.left - viewport.panX) / viewport.zoom,
      y: (screenY - rect.top - viewport.panY) / viewport.zoom,
    }
  }, [viewport])

  // FIX: Auto-pan when dragging near edge
  const startAutoPan = useCallback(() => {
    if (autoPanRef.current) return
    const tick = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect || !dragRef.current) {
        if (autoPanRef.current) cancelAnimationFrame(autoPanRef.current)
        autoPanRef.current = null
        return
      }
      const mx = mouseScreenRef.current.x - rect.left
      const my = mouseScreenRef.current.y - rect.top
      let dx = 0, dy = 0
      if (mx < AUTO_PAN_ZONE) dx = AUTO_PAN_SPEED
      if (mx > rect.width - AUTO_PAN_ZONE) dx = -AUTO_PAN_SPEED
      if (my < AUTO_PAN_ZONE) dy = AUTO_PAN_SPEED
      if (my > rect.height - AUTO_PAN_ZONE) dy = -AUTO_PAN_SPEED

      if (dx !== 0 || dy !== 0) {
        setViewport((v) => ({ ...v, panX: v.panX + dx, panY: v.panY + dy }))
      }
      autoPanRef.current = requestAnimationFrame(tick)
    }
    autoPanRef.current = requestAnimationFrame(tick)
  }, [])

  const stopAutoPan = useCallback(() => {
    if (autoPanRef.current) {
      cancelAnimationFrame(autoPanRef.current)
      autoPanRef.current = null
    }
  }, [])

  // Canvas mouse down
  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle button or space+click = pan
    if (e.button === 1 || (e.button === 0 && spaceRef.current)) {
      e.preventDefault()
      isPanning.current = true
      panStart.current = { x: e.clientX, y: e.clientY, panX: viewport.panX, panY: viewport.panY }
      return
    }
    // Left click on empty canvas = start lasso or clear selection
    if (e.button === 0) {
      const target = e.target as HTMLElement
      // Only start lasso if clicking on the canvas background (transform layer or container)
      if (target === e.currentTarget || target.closest("[data-slot='transform-layer']") === target) {
        dispatch({ type: "CLEAR_SELECTION" })
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        lassoStart.current = { screenX: e.clientX, screenY: e.clientY }
        setLasso({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: 0, h: 0 })
      }
    }
  }, [viewport])

  // Canvas mouse move
  const onCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    mouseScreenRef.current = { x: e.clientX, y: e.clientY }

    // Panning
    if (isPanning.current) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setViewport((v) => ({ ...v, panX: panStart.current.panX + dx, panY: panStart.current.panY + dy }))
      return
    }

    // Lasso selection
    if (lassoStart.current) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setLasso({
        x: lassoStart.current.screenX - rect.left,
        y: lassoStart.current.screenY - rect.top,
        w: e.clientX - lassoStart.current.screenX,
        h: e.clientY - lassoStart.current.screenY,
      })
      return
    }

    // Connection drag preview
    if (connDragRef.current) {
      const canvas = screenToCanvas(e.clientX, e.clientY)
      setConnPreview((prev) => prev ? { ...prev, ex: canvas.x, ey: canvas.y } : null)
      return
    }

    // Multi-node drag
    if (dragRef.current) {
      const canvas = screenToCanvas(e.clientX, e.clientY)
      const dx = canvas.x - dragRef.current.startX
      const dy = canvas.y - dragRef.current.startY
      const moves: Array<{ id: string; x: number; y: number }> = []
      for (const [id, orig] of dragRef.current.origPositions) {
        moves.push({ id, x: snap(orig.x + dx), y: snap(orig.y + dy) })
      }
      dispatch({ type: "MOVE_NODES", moves })
      startAutoPan()
    }
  }, [viewport, screenToCanvas, startAutoPan])

  // Canvas mouse up
  const onCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    isPanning.current = false

    // Finish lasso
    if (lassoStart.current && lasso) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect && (Math.abs(lasso.w) > 5 || Math.abs(lasso.h) > 5)) {
        // Convert lasso screen rect to canvas coords
        const lx = Math.min(lasso.x, lasso.x + lasso.w)
        const ly = Math.min(lasso.y, lasso.y + lasso.h)
        const lw = Math.abs(lasso.w)
        const lh = Math.abs(lasso.h)

        const canvasLeft = (lx - viewport.panX) / viewport.zoom
        const canvasTop = (ly - viewport.panY) / viewport.zoom
        const canvasRight = canvasLeft + lw / viewport.zoom
        const canvasBottom = canvasTop + lh / viewport.zoom

        const selected: string[] = []
        for (const node of nodes.values()) {
          const nodeRight = node.x + node.width
          const nodeBottom = node.y + node.height
          if (node.x < canvasRight && nodeRight > canvasLeft && node.y < canvasBottom && nodeBottom > canvasTop) {
            selected.push(node.id)
          }
        }
        if (selected.length > 0) dispatch({ type: "SET_SELECTION", ids: selected })
      }
      lassoStart.current = null
      setLasso(null)
    }

    // Finish connection drag — drop on a port element
    if (connDragRef.current) {
      const drag = connDragRef.current
      // Look for any port under cursor (input ports for new connections / target handle drags)
      const portEl = (e.target as HTMLElement).closest('[data-port-type]') as HTMLElement | null

      if (portEl) {
        const dropNodeId = portEl.dataset.nodeId
        const dropPort = portEl.dataset.port as PortName | undefined

        if (dropNodeId && dropNodeId !== drag.sourceNodeId) {
          const edgeId = `edge-${drag.sourceNodeId}-${dropNodeId}-${Date.now().toString(36)}`

          if (drag.handle === "source") {
            // We were dragging the source handle — the "sourceNodeId" is actually the original target
            // The drop target becomes the new source
            dispatch({
              type: "ADD_EDGE",
              edge: { id: edgeId, source: dropNodeId, target: drag.sourceNodeId, sourcePort: dropPort ?? "right", targetPort: drag.sourcePort },
            })
          } else {
            // Normal: dragging from source output to target input, or dragging target handle
            dispatch({
              type: "ADD_EDGE",
              edge: { id: edgeId, source: drag.sourceNodeId, target: dropNodeId, sourcePort: drag.sourcePort, targetPort: dropPort ?? "left" },
            })
          }
        }
      }
      // If dropped on empty space, the edge is simply deleted (already removed)
      connDragRef.current = null
      setConnPreview(null)
    }

    // Finish node drag
    if (dragRef.current) {
      dragRef.current = null
      stopAutoPan()
    }
  }, [lasso, viewport, nodes, stopAutoPan, screenToCanvas])

  // FIX: Node mouse down — multi-select drag
  const onNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return
    e.stopPropagation()

    let newSelection: Set<string>
    if (e.shiftKey) {
      dispatch({ type: "TOGGLE_SELECTION", id: nodeId })
      newSelection = new Set(selection)
      if (newSelection.has(nodeId)) newSelection.delete(nodeId)
      else newSelection.add(nodeId)
    } else if (!selection.has(nodeId)) {
      dispatch({ type: "SET_SELECTION", ids: [nodeId] })
      newSelection = new Set([nodeId])
    } else {
      newSelection = selection
    }

    const canvas = screenToCanvas(e.clientX, e.clientY)

    // Build original positions of all selected nodes
    const origPositions = new Map<string, { x: number; y: number }>()
    const dragIds = newSelection.has(nodeId) ? newSelection : new Set([nodeId])
    for (const id of dragIds) {
      const n = nodes.get(id)
      if (n) origPositions.set(id, { x: n.x, y: n.y })
    }

    dragRef.current = { startX: canvas.x, startY: canvas.y, origPositions }
  }, [selection, screenToCanvas, nodes])

  // Port mouse down — start drawing a new edge
  const onPortMouseDown = useCallback((e: React.MouseEvent, nodeId: string, port: PortName) => {
    e.stopPropagation()
    const node = nodes.get(nodeId)
    if (!node) return
    const portPos = getPortPos(node, port)
    const canvas = screenToCanvas(e.clientX, e.clientY)
    connDragRef.current = { sourceNodeId: nodeId, sourcePort: port, startCanvasX: portPos.x, startCanvasY: portPos.y }
    setConnPreview({ sx: portPos.x, sy: portPos.y, ex: canvas.x, ey: canvas.y })
  }, [nodes, screenToCanvas])

  // Edge handle drag — re-route a connector by dragging its source or target handle
  const onEdgeHandleDrag = useCallback((e: React.MouseEvent, edgeId: string, handle: "source" | "target") => {
    const edge = edges.get(edgeId)
    if (!edge) return

    if (handle === "source") {
      // Detach source: keep target fixed, drag from target back to mouse
      const tgtNode = nodes.get(edge.target)
      if (!tgtNode) return
      const tgtPortPos = getPortPos(tgtNode, edge.targetPort ?? "left")
      const canvas = screenToCanvas(e.clientX, e.clientY)
      connDragRef.current = {
        sourceNodeId: edge.target,
        sourcePort: (edge.targetPort ?? "left") as PortName,
        startCanvasX: tgtPortPos.x,
        startCanvasY: tgtPortPos.y,
        edgeId,
        handle: "source",
      }
      setConnPreview({ sx: tgtPortPos.x, sy: tgtPortPos.y, ex: canvas.x, ey: canvas.y })
    } else {
      // Detach target: keep source fixed, drag from source to mouse
      const srcNode = nodes.get(edge.source)
      if (!srcNode) return
      const srcPortPos = getPortPos(srcNode, edge.sourcePort ?? "right")
      const canvas = screenToCanvas(e.clientX, e.clientY)
      connDragRef.current = {
        sourceNodeId: edge.source,
        sourcePort: (edge.sourcePort ?? "right") as PortName,
        startCanvasX: srcPortPos.x,
        startCanvasY: srcPortPos.y,
        edgeId,
        handle: "target",
      }
      setConnPreview({ sx: srcPortPos.x, sy: srcPortPos.y, ex: canvas.x, ey: canvas.y })
    }

    // Remove the old edge immediately — will be re-created on drop
    dispatch({ type: "DELETE_EDGES", edgeIds: [edgeId] })
    dispatch({ type: "CLEAR_SELECTION" })
  }, [edges, nodes, screenToCanvas])

  // Edge click
  const onEdgeClick = useCallback((e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation()
    dispatch({ type: "SET_SELECTION", ids: [edgeId] })
  }, [])

  // Add node in center of viewport
  const addNode = useCallback((type: StepType) => {
    const id = `step-${Date.now().toString(36)}`
    const cx = (-viewport.panX + containerRect.width / 2) / viewport.zoom
    const cy = (-viewport.panY + containerRect.height / 2) / viewport.zoom
    dispatch({
      type: "ADD_NODE",
      node: { id, x: snap(cx - NODE_W / 2), y: snap(cy - NODE_H / 2), width: NODE_W, height: NODE_H, data: { id, type, name: `New ${STEP_TYPES[type].label} Step`, description: "Configure this step..." } },
    })
  }, [viewport, containerRect])

  // Auto layout
  const runAutoLayout = useCallback(() => {
    const n = cloneMap(nodes)
    autoLayout(n, edges)
    dispatch({ type: "INIT", nodes: n, edges: cloneMap(edges) })
    setTimeout(fitToView, 50)
  }, [nodes, edges, fitToView])

  // Minimap viewport drag
  const onMinimapViewportDrag = useCallback((panX: number, panY: number) => {
    setViewport((v) => ({ ...v, panX, panY }))
  }, [])

  // FIX: Keyboard — delete works on container focus too
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault()
        spaceRef.current = true
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        // Allow from body or when canvas has focus
        const tag = (e.target as HTMLElement).tagName
        if (tag === "INPUT" || tag === "TEXTAREA") return
        e.preventDefault()
        dispatch({ type: "DELETE_SELECTED" })
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) dispatch({ type: "UNDO" })
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) dispatch({ type: "REDO" })
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") { spaceRef.current = false; isPanning.current = false }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("keyup", onKeyUp)
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKeyUp) }
  }, [])

  const nodeArr = useMemo(() => Array.from(nodes.values()), [nodes])
  const edgeArr = useMemo(() => Array.from(edges.values()), [edges])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-lg border bg-background outline-none",
        spaceRef.current ? "cursor-grab" : "cursor-default",
        className
      )}
      onWheel={onWheel}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
      onMouseLeave={onCanvasMouseUp}
      {...props}
    >
      <GridBackground zoom={viewport.zoom} />

      {/* Transform layer */}
      <div
        data-slot="transform-layer"
        className="absolute origin-top-left"
        style={{ transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`, willChange: "transform" }}
      >
        {/* SVG layer for connector VISUALS (below nodes, no pointer events) */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", top: 0, left: 0, width: "1px", height: "1px", overflow: "visible", pointerEvents: "none", zIndex: 0 }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
            </marker>
            <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
            </marker>
          </defs>
          {edgeArr.map((edge) => {
            const src = nodes.get(edge.source)
            const tgt = nodes.get(edge.target)
            if (!src || !tgt) return null
            const points = routeOrthogonal(src, tgt, edge.sourcePort ?? "right", edge.targetPort ?? "left")
            const d = pointsToPath(points, 8)
            const sel = selection.has(edge.id)
            return (
              <g key={edge.id}>
                <path d={d} fill="none" stroke={sel ? "#3b82f6" : "#94a3b8"} strokeWidth={sel ? 2.5 : 2}
                  markerEnd={sel ? "url(#arrowhead-active)" : "url(#arrowhead)"} style={{ transition: "stroke 0.15s" }} />
                {sel && (() => {
                  const startPt = points[0], endPt = points[points.length - 1]
                  return (
                    <>
                      <circle cx={startPt.x} cy={startPt.y} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} />
                      <circle cx={endPt.x} cy={endPt.y} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} />
                    </>
                  )
                })()}
              </g>
            )
          })}
          {connPreview && (
            <line x1={connPreview.sx} y1={connPreview.sy} x2={connPreview.ex} y2={connPreview.ey}
              stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" opacity={0.6} />
          )}
        </svg>

        {/* Nodes */}
        {nodeArr.map((node) => (
          <FlowNode key={node.id} node={node} selected={selection.has(node.id)} onMouseDown={onNodeMouseDown} onPortMouseDown={onPortMouseDown} />
        ))}

        {/* SVG layer for connector HIT AREAS + drag handles (above nodes, interactive) */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "1px", height: "1px", overflow: "visible", zIndex: 10 }}
        >
          {edgeArr.map((edge) => {
            const src = nodes.get(edge.source)
            const tgt = nodes.get(edge.target)
            if (!src || !tgt) return null
            const points = routeOrthogonal(src, tgt, edge.sourcePort ?? "right", edge.targetPort ?? "left")
            const d = pointsToPath(points, 8)
            const sel = selection.has(edge.id)
            const startPt = points[0], endPt = points[points.length - 1]
            return (
              <g key={edge.id}>
                {/* Wide transparent hit area for clicking */}
                <path d={d} fill="none" stroke="transparent" strokeWidth={16}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); onEdgeClick(e, edge.id) }} />
                {/* Drag handles when selected */}
                {sel && (
                  <>
                    <circle cx={startPt.x} cy={startPt.y} r={8} fill="transparent"
                      style={{ cursor: "grab" }}
                      onMouseDown={(e) => { e.stopPropagation(); onEdgeHandleDrag(e, edge.id, "source") }} />
                    <circle cx={endPt.x} cy={endPt.y} r={8} fill="transparent"
                      style={{ cursor: "grab" }}
                      onMouseDown={(e) => { e.stopPropagation(); onEdgeHandleDrag(e, edge.id, "target") }} />
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Lasso */}
      <LassoOverlay rect={lasso} />

      {/* Toolbar */}
      <Toolbar
        zoom={viewport.zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onFitToView={fitToView} onAutoLayout={runAutoLayout}
        onUndo={() => dispatch({ type: "UNDO" })} onRedo={() => dispatch({ type: "REDO" })}
        onDeleteSelected={() => dispatch({ type: "DELETE_SELECTED" })} onAddNode={addNode}
        canUndo={undoStack.length > 0} canRedo={redoStack.length > 0} hasSelection={selection.size > 0}
      />

      {/* Minimap */}
      <Minimap nodes={nodes} viewport={viewport} containerRect={containerRect} onViewportDrag={onMinimapViewportDrag} />

      <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/60 z-10">
        Scroll to pan · Ctrl+Scroll to zoom · Space+Drag to pan · Drag to lasso select
      </div>
    </div>
  )
}
