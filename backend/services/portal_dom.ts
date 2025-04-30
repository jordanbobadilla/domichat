// Simularemos una base de datos de usuarios
const usuariosSuscripciones = new Map<
  number,
  { activo: boolean; expiracion: Date }
>()

export function crearEnlaceDePagoSimulado(userId: number): string {
  return `https://portal.dom/pago-fake?user_id=${userId}`
}

export async function registrarPagoSimulado(userId: number): Promise<boolean> {
  if (!userId) return false

  // Guardamos estado de suscripción
  const expiracion = new Date()
  expiracion.setMonth(expiracion.getMonth() + 1) // 1 mes

  usuariosSuscripciones.set(userId, { activo: true, expiracion })
  return true
}

export function verificarSuscripcionActiva(userId: number): boolean {
  const suscripcion = usuariosSuscripciones.get(userId)
  if (!suscripcion) return false

  return suscripcion.activo && suscripcion.expiracion > new Date()
}
