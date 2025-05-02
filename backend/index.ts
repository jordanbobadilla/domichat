import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./api/auth.routes"
import chatRoutes from "./api/chat.routes"
import subscriptionRoutes from "./api/subscription.routes"
import datasetRoutes from "./api/dataset.routes"

// Inicializar configuración
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/subscription", subscriptionRoutes)

app.use("/api/dataset", datasetRoutes)

// Ruta de prueba
app.get("/", (_req, res) => {
  res.send("El Backend de DomiChat está activo ✅")
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`)
})
