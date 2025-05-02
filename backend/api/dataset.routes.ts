import express from "express"
import fs from "fs"
import path from "path"

const router = express.Router()
const datasetPath = path.join(
  __dirname,
  "../../data/dataset/dataset_dominicano.jsonl"
)

router.post("/agregar", (req, res) => {
  const { pregunta, respuesta } = req.body

  if (!pregunta || !respuesta) {
    res.status(400).json({ error: "Faltan campos" })
    return
  }

  const entrada = JSON.stringify({ pregunta, respuesta })

  fs.appendFile(datasetPath, entrada + "\n", (err) => {
    if (err) {
      console.error("Error al guardar entrada:", err)
      return res.status(500).json({ error: "No se pudo guardar" })
    }

    return res.json({ mensaje: "Entrada guardada" })
  })
})

export default router
