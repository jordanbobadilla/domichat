import { response, Router } from "express"
import { generarToken } from "../utils/jwt"

const router = Router()

// En un caso real, conecta con una base de datos y hashea contraseñas
const usuariosDummy = [
  { id: 1, email: "demo@domichat.do", password: "123456", nombre: "Demo Domi" },
]

router.post("/login", (req, res) => {
  const { email, password } = req.body
  const usuario = usuariosDummy.find(
    (u) => u.email === email && u.password === password
  )

  if (!usuario) {
    res.status(401).json({ mensaje: "Credenciales inválidas" })
  }

  const token = generarToken({ id: usuario?.id, email: usuario?.email })
  res.json({ token, usuario: { id: usuario?.id, nombre: usuario?.nombre } })
})

// router.post("/login", (req, res) => {
//   const { email, password } = req.body
//   const usuario = usuariosDummy.find(
//     (u) => u.email === email && u.password === password
//   )

//   if (!usuario) {
//     return res.status(401).json({ mensaje: "Credenciales inválidas" })
//   }

//   const token = generarToken({ id: usuario.id, email: usuario.email })
//   res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre } })
// })

router.post("/registro", (req, res) => {
  // Aquí agregarías lógica real de registro
  res.json({ mensaje: "Registro simulado exitoso" })
})

export default router
