import { Router } from "express"
import { autenticarToken } from "../middleware/authMiddleware"
import {
  crearEnlaceDePagoSimulado,
  registrarPagoSimulado,
} from "../services/portal_dom"

const router = Router()

// Iniciar pago (a futuro: redirigir a Portal DOM)
router.post("/iniciar", autenticarToken, async (req, res) => {
  const usuario = (req as any).usuario
  const enlacePago = crearEnlaceDePagoSimulado(usuario.id)

  res.json({ url_pago: enlacePago })
})

// Webhook simulado (cuando Portal DOM confirme el pago)
router.post("/confirmar", async (req, res) => {
  const { user_id } = req.body
  const ok = await registrarPagoSimulado(user_id)

  if (ok) res.json({ mensaje: "Suscripción activada" })
  res.status(400).json({ error: "Usuario no encontrado" })
})

export default router
