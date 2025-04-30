// backend/api/subscription.routes.ts

import { Router } from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import { registrarPago } from "../services/portal_dom"

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

export default router
