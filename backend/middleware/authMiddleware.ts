import { Request, Response, NextFunction } from "express"
import { verificarToken } from "../utils/jwt"

export function autenticarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ mensaje: "No autorizado" })
    return
  }

  const token = authHeader?.split(" ")[1]

  try {
    const usuario = verificarToken(token ?? "")
    ;(req as any).usuario = usuario // se puede tipar mejor si usas interfaces
    next()
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido o expirado" })
  }
}
