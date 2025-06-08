export function verificarSesion():
  | { token: string; nombre: string; email?: string }
  | null {
  const token = localStorage.getItem("token")
  const nombre = localStorage.getItem("nombre")
  const email = localStorage.getItem("email")

  if (!token || !nombre) {
    window.location.href = "/login"
    return null
  }

  return { token, nombre, email: email || undefined }
}
