import axios from "axios"

export interface ChatMensaje {
  mensaje: string
  respuesta: string
  creadoEn: string
}

export function generarTitulo(mensajes: { rol: string; texto: string }[]): string {
  const primer = mensajes.find((m) => m.rol === "usuario")?.texto || "Chat sin título"
  return primer.length < 30 ? primer : primer.slice(0, 30) + "..."
}

export async function guardarHistorial(
  token: string,
  mensajes: ChatMensaje[]
) {
  const titulo = generarTitulo(mensajes.map((m) => ({ rol: "usuario", texto: m.mensaje })))
  const data = { titulo, fecha: new Date().toISOString(), mensajes }
  await axios.post("http://localhost:4000/api/chat/historial", data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
