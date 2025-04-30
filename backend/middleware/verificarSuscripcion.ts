import { Request, Response, NextFunction } from "express"
import { verificarSuscripcionActiva } from "../services/portal_dom"

export async function verificarSuscripcion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const usuario = (req as any).usuario

  if (!usuario?.id) {
    res.status(401).json({ error: "No autenticado" })
    return
  }

  const activo = await verificarSuscripcionActiva(usuario.id)

  if (!activo) {
    res.status(403).json({
      error: "Requiere suscripción activa para acceder a esta función.",
    })
    return
  }

  next()
}
