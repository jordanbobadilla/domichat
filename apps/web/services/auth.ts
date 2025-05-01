export function verificarSesion(): { token: string; nombre: string } | null {
  const token = localStorage.getItem("token")
  const nombre = localStorage.getItem("nombre")

  if (!token || !nombre) {
    window.location.href = "/login"
    return null
  }

  return { token, nombre }
}
