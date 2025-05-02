import express from "express"
import fs from "fs"
import path from "path"
import readline from "readline"

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

router.get("/listar", (req, res) => {
  const resultados: { pregunta: string; respuesta: string }[] = []

  try {
    const archivo = fs.createReadStream(datasetPath)

    const rl = readline.createInterface({
      input: archivo,
      crlfDelay: Infinity,
    })

    rl.on("line", (line) => {
      try {
        const entrada = JSON.parse(line)
        resultados.push(entrada)
      } catch (e) {
        console.warn("Línea inválida en el dataset:", line)
      }
    })

    rl.on("close", () => {
      res.json(resultados)
    })
  } catch (error) {
    console.error("Error leyendo el dataset:", error)
    res.status(500).json({ error: "No se pudo leer el dataset" })
  }
})

export default router
