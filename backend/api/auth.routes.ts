// backend/api/auth.routes.ts

import { Router } from "express"
import prisma from "../db/prisma"
import bcrypt from "bcrypt"
import { generarToken } from "../utils/jwt"

const router = Router()

// Registro de usuario
router.post("/registro", async (req, res) => {
  const { email, password, nombre } = req.body

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    })

    if (usuarioExistente) {
      res.status(400).json({ error: "Este email ya está registrado." })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        nombre,
        password: hashedPassword,
      },
    })

    const token = generarToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
    })

    res.status(201).json({
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
      },
    })
  } catch (error) {
    console.error("Error en registro:", error)
    res.status(500).json({ error: "Error al registrar usuario." })
  }
})

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario) {
      res
        .status(401)
        .json({ error: "Credenciales inválidas. El usuario no es válido." })
      return
    }

    const passwordValido = await bcrypt.compare(password, usuario?.password)

    if (!passwordValido) {
      res
        .status(401)
        .json({ error: "Credenciales inválidas. La contraseña no es válida." })
      return
    }

    const token = generarToken({ id: usuario?.id, email: usuario?.email })

    res.json({
      token,
      usuario: {
        id: usuario?.id,
        nombre: usuario?.nombre,
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ error: "Error al iniciar sesión." })
  }
})

export default router
