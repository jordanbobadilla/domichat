import { Request, Response, NextFunction } from "express"
import { verificarSuscripcionActiva } from "../services/portal_dom"

export async function verificarSuscripcion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const usuario = (req as any).usuario

  if (!usuario?.id) {
    return res.status(401).json({ error: "No autenticado" })
  }

  const activo = await verificarSuscripcionActiva(usuario.id)

  if (!activo) {
    return res
      .status(403)
      .json({
        error: "Requiere suscripción activa para acceder a esta función.",
      })
  }

  next()
}
