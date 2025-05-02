import express from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import {
  cargarDataset,
  responderDesdeDatasetConScore,
} from "../controllers/chat_rag"
import prisma from "../db/prisma"
import OpenAI from "openai"

const router = express.Router()
const THRESHOLD = 0.1 // umbral de similitud para RAG
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
  } catch (err: any) {
    console.error("Error híbrido RAG/GPT:", err)
    res.status(500).json({ error: "Error interno del sistema." })
  }
})

router.get("/historial", autenticarToken, async (req, res) => {
  try {
    const userId = (req as any).usuario.id
    const historial = await prisma.chat.findMany({
      where: { usuarioId: userId },
      orderBy: { creadoEn: "asc" },
      select: { mensaje: true, respuesta: true, creadoEn: true },
    })
    res.json({ historial })
  } catch (err: any) {
    console.error("Error obteniendo historial:", err)
    res.status(500).json({ error: "No se pudo obtener el historial." })
  }
})

export default router
