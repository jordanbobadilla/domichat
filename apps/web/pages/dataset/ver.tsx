import { useEffect, useState } from "react"
import axios from "axios"
import { colors } from "../../constants/colors"

interface Entrada {
  pregunta: string
  respuesta: string
}

export default function VerDataset() {
  const [entradas, setEntradas] = useState<Entrada[]>([])

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/dataset/listar")
      .then((res) => setEntradas(res.data))
      .catch(() => {})
  }, [])

  const descargar = () => {
    const contenido = entradas.map((e) => JSON.stringify(e)).join("\n")
    const blob = new Blob([contenido], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "dataset_dominicano.jsonl"
    link.click()
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        paddingTop: 40,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <h2 style={{ color: colors.primario }}>📄 Dataset Dominicano (vista)</h2>

      <p style={{ marginTop: 10, marginBottom: 30 }}>
        Total: <strong>{entradas.length}</strong> entradas
      </p>

      {entradas.length === 0 ? (
        <p>No hay datos todavía.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {entradas.map((e, i) => (
            <li key={i} style={styles.card}>
              <p style={styles.pregunta}>
                <strong>Pregunta:</strong> {e.pregunta}
              </p>
              <p>
                <strong>Respuesta:</strong> {e.respuesta}
              </p>
            </li>
          ))}
        </ul>
      )}

      {entradas.length > 0 && (
        <button onClick={descargar} style={styles.boton}>
          Descargar JSONL
        </button>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#fff",
    border: `1px solid ${colors.borde}`,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  pregunta: {
    marginBottom: 6,
  },
  boton: {
    backgroundColor: colors.primario,
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 20,
  },
}
