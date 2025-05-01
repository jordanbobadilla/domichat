import { Router } from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import { registrarPago } from "../services/portal_dom"
import prisma from "../db/prisma"

const router = Router()

// Confirmar pago (ej. webhook simulado)
router.post("/confirmar", autenticarToken, async (req, res) => {
  const usuario = (req as any).usuario

  const ok = await registrarPago(usuario.id)
  if (ok) {
    res.json({ mensaje: "Suscripción activada con éxito." })
    return
  }

  res.status(400).json({ error: "Error al activar suscripción." })
})

router.get("/estado", autenticarToken, async (req, res) => {
  const usuario = (req as any).usuario

  const sub = await prisma.suscripcion.findUnique({
    where: { usuarioId: usuario.id },
    select: { activa: true, expiracion: true },
  })

  if (!sub) {
    res.json({ activa: false })
    return
  }

  res.json({
    activa: sub.activa,
    expiracion: sub.expiracion,
  })
})

export default router
