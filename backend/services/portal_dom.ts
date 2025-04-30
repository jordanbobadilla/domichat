import prisma from "../db/prisma"

/** Crear o actualizar la suscripción del usuario */
export async function registrarPago(userId: string): Promise<boolean> {
  try {
    const expiracion = new Date()
    expiracion.setMonth(expiracion.getMonth() + 1) // 1 mes

    const usuario = await prisma.usuario.findUnique({ where: { id: userId } })
    if (!usuario) return false

    const existente = await prisma.suscripcion.findUnique({
      where: { usuarioId: userId },
    })

    if (existente) {
      await prisma.suscripcion.update({
        where: { usuarioId: userId },
        data: { activa: true, expiracion },
      })
    } else {
      await prisma.suscripcion.create({
        data: {
          usuarioId: userId,
          activa: true,
          expiracion,
        },
      })
    }

    return true
  } catch (error) {
    console.error("Error al registrar suscripción:", error)
    return false
  }
}

/** Verifica si el usuario tiene una suscripción activa y válida */
export async function verificarSuscripcionActiva(
  userId: string
): Promise<boolean> {
  const sub = await prisma.suscripcion.findUnique({
    where: { usuarioId: userId },
  })

  if (!sub || !sub.activa) return false
  return sub.expiracion > new Date()
}
