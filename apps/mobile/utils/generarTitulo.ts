export function generarTitulo(
  mensajes: { rol: string; texto: string }[]
): string {
  const primerMensaje =
    mensajes.find((m) => m.rol === "usuario")?.texto || "Chat sin título"
  if (primerMensaje.length < 30) return primerMensaje
  return primerMensaje.slice(0, 30) + "..."
}
