import { Router } from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import { verificarSuscripcion } from "../middleware/verificarSuscripcion"
import { obtenerRespuestaIA } from "../services/ai_model"
import prisma from "../db/prisma"

const router = Router()

router.post("/", autenticarToken, verificarSuscripcion, async (req, res) => {
  const { mensaje } = req.body
  const usuario = (req as any).usuario

  if (!mensaje || mensaje.trim() === "") {
    res.status(400).json({ error: "Mensaje vacío" })
    return
  }

  try {
    // Obtener respuesta del modelo IA
    const respuesta = await obtenerRespuestaIA(mensaje)

    // Guardar historial en la base de datos
    await prisma.chat.create({
      data: {
        usuarioId: usuario.id,
        mensaje,
        respuesta,
      },
    })

    // Responder al frontend
    res.json({ respuesta })
  } catch (error) {
    console.error("Error en chat:", error)
    res.status(500).json({ error: "Ocurrió un error procesando tu mensaje." })
  }
})

router.get("/historial", autenticarToken, async (req, res) => {
  const usuario = (req as any).usuario

  try {
    const historial = await prisma.chat.findMany({
      where: { usuarioId: usuario.id },
      orderBy: { creadoEn: "desc" },
      select: {
        id: true,
        mensaje: true,
        respuesta: true,
        creadoEn: true,
      },
    })

    res.json({ historial })
  } catch (error) {
    console.error("Error obteniendo historial:", error)
    res.status(500).json({ error: "No se pudo recuperar el historial." })
  }
})

export default router
