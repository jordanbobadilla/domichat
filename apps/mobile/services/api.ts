import config from "../constants/config"

export const BASE_URL = config.BASE_URL

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error("Login fallido")
  return await res.json()
}

export async function getHistorial(token: string) {
  const res = await fetch(`${BASE_URL}/chat/historial`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Error al obtener historial")
  return await res.json() // contiene { historial: [...] }
}

export async function getEstadoSuscripcion(token: string) {
  const res = await fetch(`${BASE_URL}/subscription/estado`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Error al obtener suscripción")
  return await res.json() // { activa: true, expiracion: '...' }
}

export async function confirmarSuscripcion(token: string) {
  const res = await fetch(`${BASE_URL}/subscription/confirmar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("No se pudo activar la suscripción")
  return await res.json() // { mensaje: 'Suscripción activada con éxito.' }
}
