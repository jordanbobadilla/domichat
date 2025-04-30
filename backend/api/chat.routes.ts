import { Router } from "express"
import { obtenerRespuestaIA } from "../services/ai_model"
import { autenticarToken } from "../middleware/authMidleware"

const router = Router()

// Ruta protegida: solo usuarios autenticados pueden usarla
router.post("/", autenticarToken, async (req, res) => {
  const { mensaje } = req.body

  if (!mensaje || mensaje.trim() === "") {
    res.status(400).json({ error: "Mensaje vacío" })
  }

  const respuesta = await obtenerRespuestaIA(mensaje)
  res.json(respuesta)
})

export default router
