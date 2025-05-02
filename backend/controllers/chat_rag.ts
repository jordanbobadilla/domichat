import fs from "fs"
import path from "path"
import readline from "readline"
import natural from "natural"

const datasetPath = path.join(
  __dirname,
  "../../data/dataset/dataset_dominicano.jsonl"
)
const dataset: { pregunta: string; respuesta: string }[] = []

// Carga el dataset una sola vez al arrancar
export async function cargarDataset(): Promise<void> {
  return new Promise((resolve) => {
    const rs = fs.createReadStream(datasetPath)
    const rl = readline.createInterface({ input: rs, crlfDelay: Infinity })
    rl.on("line", (line) => {
      try {
        dataset.push(JSON.parse(line))
      } catch {}
    })
    rl.on("close", resolve)
  })
}

// Devuelve respuesta + score de similitud
export function responderDesdeDatasetConScore(pregunta: string): {
  respuesta: string
  score: number
} {
  if (dataset.length === 0)
    return { respuesta: "El dataset está vacío.", score: 0 }

  const tfidf = new natural.TfIdf()
  dataset.forEach((item) => tfidf.addDocument(item.pregunta))

  let mejorScore = 0
  let mejorIdx = 0
  tfidf.tfidfs(pregunta, (i, score) => {
    if (score > mejorScore) {
      mejorScore = score
      mejorIdx = i
    }
  })

  return {
    respuesta: dataset[mejorIdx].respuesta,
    score: mejorScore,
  }
}
