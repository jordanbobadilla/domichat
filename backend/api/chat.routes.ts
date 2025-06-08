import express from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import {
  cargarDataset,
  responderDesdeDatasetConScore,
} from "../controllers/chat_rag"
import prisma from "../db/prisma"
import OpenAI from "openai"

const router = express.Router()
const THRESHOLD = 0.9 // umbral de similitud para RAG
let datasetCargado = false

// Cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

router.post("/", autenticarToken, async (req, res) => {
  const { mensaje } = req.body
  if (!mensaje) {
    res.status(400).json({ error: "Falta el mensaje." })
    return
  }

  try {
    // 1) Carga el dataset la primera vez
    if (!datasetCargado) {
      await cargarDataset()
      datasetCargado = true
    }

    // 2) Intenta responder desde el dataset local
    const { respuesta: respLocal, score } =
      responderDesdeDatasetConScore(mensaje)
    if (score >= THRESHOLD) {
      // Guarda en Prisma
      await prisma.chat.create({
        data: {
          usuarioId: (req as any).usuario.id,
          mensaje,
          respuesta: respLocal,
        },
      })

      res.json({ respuesta: respLocal, fuente: "dataset", score })
      return
    }

    // 3) Si no hay buen match, fallback a GPT-4 Turbo
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
    const respGPT =
      completion.choices[0].message?.content?.trim() ||
      "Lo siento, no tengo una respuesta."

    // Guarda en Prisma
    await prisma.chat.create({
      data: {
        usuarioId: (req as any).usuario.id,
        mensaje,
        respuesta: respGPT,
      },
    })

    res.json({ respuesta: respGPT, fuente: "gpt", score })
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
    res.json(historial)
    return
  } catch (error) {
    res.status(500).json({ error: "Error al crear historial" })
  }
})

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

export default router
