import { useState, useContext } from "react"
import { temas } from "../constants/colors"
import { ThemeContext } from "../context/ThemeContext"
import axios from "axios"

interface Entrada {
  pregunta: string
  respuesta: string
}

export default function DatasetForm() {
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [entradas, setEntradas] = useState<Entrada[]>([])
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  const agregarEntrada = async () => {
    if (!pregunta || !respuesta) return

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/dataset/agregar`, {
      pregunta,
      respuesta,
    })

    const nueva = { pregunta, respuesta }
    setEntradas([...entradas, nueva])
    setPregunta("")
    setRespuesta("")
  }

  const exportar = () => {
    const contenido = entradas.map((e) => JSON.stringify(e)).join("\n")

    const blob = new Blob([contenido], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = "dataset_dominicano.jsonl"
    link.href = url
    link.click()
  }

  const styles = {
    textarea: {
      width: "100%",
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
      borderRadius: 8,
      border: `1px solid ${colors.borde}`,
      backgroundColor: colors.input,
      color: colors.texto,
    },
    boton: {
      backgroundColor: colors.primario,
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      marginTop: 8,
    },
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        paddingTop: 40,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: colors.fondo,
      }}
    >
      <h2 style={{ color: colors.primario }}>Crear Dataset Dominicano 🇩🇴</h2>

      <textarea
        placeholder="Pregunta"
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        style={styles.textarea}
      />

      <textarea
        placeholder="Respuesta"
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={agregarEntrada} style={styles.boton}>
        Agregar
      </button>

      <hr style={{ marginTop: 30, marginBottom: 30 }} />

      <h3>{entradas.length} entradas</h3>

      <ul>
        {entradas.map((e, i) => (
          <li key={i} style={{ marginBottom: 12 }}>
            <strong>{e.pregunta}</strong>
            <br />
            <span>{e.respuesta}</span>
          </li>
        ))}
      </ul>

      {entradas.length > 0 && (
        <button onClick={exportar} style={styles.boton}>
          Exportar JSONL
        </button>
      )}
    </div>
  )
}
