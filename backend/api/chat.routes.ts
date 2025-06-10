import express from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import {
  cargarDataset,
  responderDesdeDatasetConScore,
} from "../controllers/chat_rag"
import prisma from "../db/prisma"
import OpenAI from "openai"
import { sseHandler, broadcastToUser } from "../utils/sse"
import { verificarToken } from "../utils/jwt"

const router = express.Router()
let datasetCargado = false

// Cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Conexión SSE para actualizaciones en tiempo real
router.get("/stream", (req, res) => {
  const token = req.query.token as string
  if (!token) {
    res.status(401).end()
    return
  }
  try {
    const usuario = verificarToken(token)
    ;(req as any).usuario = usuario
    sseHandler(req, res)
  } catch {
    res.status(403).end()
  }
})

router.post("/", autenticarToken, async (req, res) => {
  const { mensaje } = req.body
  if (!mensaje) {
    res.status(400).json({ error: "Falta el mensaje." })
    return
  }

  try {
    // 1) Priorizar respuesta de GPT-4 Turbo
    let respGPT: string | null = null
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "Eres DomiChat, un asistente dominicano conversacional.",
          },
          { role: "user", content: mensaje },
        ],
      })

      respGPT =
        completion.choices[0].message?.content?.trim() ||
        "Lo siento, no tengo una respuesta."
    } catch (err) {
      console.error("Error al obtener respuesta de OpenAI:", err)
    }

    if (respGPT) {
      const nuevo = await prisma.chat.create({
        data: {
          usuarioId: (req as any).usuario.id,
          mensaje,
          respuesta: respGPT,
        },
      })

      broadcastToUser((req as any).usuario.id, {
        tipo: "mensaje",
        mensaje: nuevo,
      })
      res.json({ respuesta: respGPT, fuente: "gpt" })
      return
    }

    // 2) Fallback al dataset local si no hubo respuesta de GPT
    if (!datasetCargado) {
      await cargarDataset()
      datasetCargado = true
    }
    const { respuesta: respLocal, score } =
      responderDesdeDatasetConScore(mensaje)

    const nuevo = await prisma.chat.create({
      data: {
        usuarioId: (req as any).usuario.id,
        mensaje,
        respuesta: respLocal,
      },
    })

    broadcastToUser((req as any).usuario.id, {
      tipo: "mensaje",
      mensaje: nuevo,
    })
    res.json({ respuesta: respLocal, fuente: "dataset", score })
    return
  } catch (err: any) {
    console.error("Error híbrido RAG/GPT:", err)
    res.status(500).json({ error: "Error interno del sistema." })
  }
})

// Obtener historial del usuario logueado
router.get("/historial", autenticarToken, async (req, res) => {
  const userId = (req as any).usuario.id

  try {
    const historial = await prisma.historial.findMany({
      where: { usuarioId: userId },
      orderBy: { fecha: "desc" },
    })

    res.json(historial)
    return
  } catch (error) {
    console.error("Error al obtener historial:", error)
    res.status(500).json({ error: "Error al obtener historial" })
  }
})

// Obtener el chat activo (mensajes después del último historial guardado)
router.get("/activo", autenticarToken, async (req, res) => {
  const userId = (req as any).usuario.id

  try {
    const ultimo = await prisma.historial.findFirst({
      where: { usuarioId: userId },
      orderBy: { fecha: "desc" },
    })
    const desde = ultimo?.fecha || new Date(0)
    const chats = await prisma.chat.findMany({
      where: { usuarioId: userId, creadoEn: { gt: desde } },
      orderBy: { creadoEn: "asc" },
    })
    res.json(chats)
  } catch (error) {
    console.error("Error al obtener chat activo:", error)
    res.status(500).json({ error: "Error al obtener chat activo" })
  }
})

router.post("/historial", autenticarToken, async (req, res) => {
  const userId = (req as any).usuario.id
  const { titulo, fecha, mensajes } = req.body
  // insert into Prisma Historial
  try {
    const historial = await prisma.historial.createMany({
      data: {
        usuarioId: userId,
        titulo: titulo,
        fecha: fecha,
        mensajes: mensajes,
      },
    })
    broadcastToUser(userId, { tipo: "reset" })
    res.json(historial)
    return
  } catch (error) {
    res.status(500).json({ error: "Error al crear historial" })
  }
})

// Ruta para renombrar un chat del historial
router.put("/historial/:id", autenticarToken, async (req, res) => {
  const { id } = req.params
  const { nuevoTitulo } = req.body
  const userId = (req as any).usuario.id

  try {
    const actualizado = await prisma.historial.updateMany({
      where: { id, usuarioId: userId },
      data: { titulo: nuevoTitulo },
    })
    res.json(actualizado)
    return
  } catch (error) {
    res.status(500).json({ error: "Error al renombrar historial" })
  }
})

// Eliminar TODO el historial del usuario
router.delete("/historial/todo", autenticarToken, async (req, res) => {
  const userId = (req as any).usuario.id

  try {
    await prisma.historial.deleteMany({
      where: { usuarioId: userId },
    })
    res.json({ eliminado: true })
    return
  } catch (error) {
    console.error("Error al eliminar todo el historial:", error)
    res.status(500).json({ error: "Error al eliminar todo el historial" })
  }
})

// Eliminar un elemento específico del historial
router.delete("/historial/:id", autenticarToken, async (req, res) => {
  const { id } = req.params
  const userId = (req as any).usuario.id

  try {
    await prisma.historial.deleteMany({
      where: { id, usuarioId: userId },
    })
    res.json({ eliminado: true })
    return
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar historial" })
  }
  })

export default router
