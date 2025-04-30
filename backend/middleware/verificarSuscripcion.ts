// backend/middleware/verificarSuscripcion.ts

import { Request, Response, NextFunction } from "express"
import { verificarSuscripcionActiva } from "../services/portal_dom"

export function verificarSuscripcion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const usuario = (req as any).usuario

  if (!usuario || !usuario.id) {
    res.status(401).json({ error: "No autenticado" })
  }

  const tieneAcceso = verificarSuscripcionActiva(usuario.id)

  if (!tieneAcceso) {
    res
      .status(403)
      .json({
        error: "Requiere suscripción activa para acceder a esta función.",
      })
  }

  next()
}
