import { Request, Response } from "express"
import { EventEmitter } from "events"

const connections: Record<string, Response[]> = {}
export const sseEmitter = new EventEmitter()

export function sseHandler(req: Request, res: Response) {
  const userId = (req as any).usuario.id

  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  })
  res.flushHeaders()

  if (!connections[userId]) connections[userId] = []
  connections[userId].push(res)

  const heartbeat = setInterval(() => {
    res.write(":\n\n")
  }, 15000)

  req.on("close", () => {
    clearInterval(heartbeat)
    connections[userId] = connections[userId].filter((r) => r !== res)
  })
}

export function broadcastToUser(userId: string, payload: any) {
  const list = connections[userId]
  if (!list) return
  const data = `data: ${JSON.stringify(payload)}\n\n`
  for (const res of list) {
    res.write(data)
  }
}
