import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import { colors } from "../constants/colors"
import { verificarSesion } from "../services/auth"

interface HistItem {
  id: string
  titulo: string
  fecha: string
}

export default function Historial() {
  const [items, setItems] = useState<HistItem[]>([])

  useEffect(() => {
    const sesion = verificarSesion()
    if (!sesion) return

    axios
      .get("http://localhost:4000/api/chat/historial", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((res) => setItems(res.data))
      .catch(() => {})
  }, [])

  return (
    <>
      <Header />
      <div style={styles.wrapper}>
        <h2 style={styles.titulo}>Historial de conversaciones</h2>
        {items.length === 0 ? (
          <p>No tienes conversaciones guardadas aún.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {items.map((item) => (
              <li key={item.id} style={styles.card}>
                <p style={styles.tituloChat}>{item.titulo}</p>
                <p style={styles.fecha}>
                  {new Date(item.fecha).toLocaleDateString()} {" "}
                  {new Date(item.fecha).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    maxWidth: 800,
    margin: "auto",
    paddingTop: 30,
    paddingLeft: 16,
    paddingRight: 16,
  },
  titulo: {
    color: colors.primario,
    fontWeight: 700,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    border: `1px solid ${colors.borde}`,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  tituloChat: {
    fontWeight: 600,
    marginBottom: 4,
  },
  fecha: {
    color: colors.texto,
    fontSize: 14,
  },
}
