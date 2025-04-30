import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto"

export function generarToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verificarToken(token: string): any {
  return jwt.verify(token, JWT_SECRET)
}
