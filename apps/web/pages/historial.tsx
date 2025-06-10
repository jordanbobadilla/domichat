import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Header from "../components/Header"
import { temas } from "../constants/colors"
import { verificarSesion } from "../services/auth"
import { ThemeContext } from "../context/ThemeContext"

interface Mensaje {
  mensaje: string
  respuesta: string
  creadoEn: string
}

interface HistItem {
  id: string
  titulo: string
  fecha: string
  mensajes: Mensaje[]
}

export default function Historial() {
  const [items, setItems] = useState<HistItem[]>([])
  const { tema } = useContext(ThemeContext)
  const router = useRouter()
  const colors = temas[tema]

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

  const abrirChat = (item: HistItem) => {
    router.push({
      pathname: "/chat",
      query: {
        historial: encodeURIComponent(JSON.stringify(item.mensajes)),
      },
    })
  }

  const renombrar = async (item: HistItem) => {
    const nuevo = prompt("Nuevo título", item.titulo)
    if (!nuevo) return

    try {
      const sesion = verificarSesion()
      if (!sesion) return

      await axios.put(
        `http://localhost:4000/api/chat/historial/${item.id}`,
        { nuevoTitulo: nuevo },
        { headers: { Authorization: `Bearer ${sesion.token}` } }
      )

      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, titulo: nuevo } : it))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar chat?")) return

    try {
      const sesion = verificarSesion()
      if (!sesion) return

      await axios.delete(`http://localhost:4000/api/chat/historial/${id}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })

      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const eliminarTodo = async () => {
    if (!confirm("¿Eliminar todo el historial?")) return

    try {
      const sesion = verificarSesion()
      if (!sesion) return

      await axios.delete("http://localhost:4000/api/chat/historial/todo", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      setItems([])
    } catch (err) {
      console.error(err)
    }
  }

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 800,
      margin: "auto",
      paddingTop: 70,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: colors.fondo,
    },
    titulo: {
      color: colors.primario,
      fontWeight: 700,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.input,
      border: `1px solid ${colors.borde}`,
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
    },
    tituloChat: {
      fontWeight: 600,
      marginBottom: 4,
      color: colors.texto,
    },
    fecha: {
      color: colors.texto,
      fontSize: 14,
    },
  }

  return (
    <>
      <Header />
      <div style={styles.wrapper}>
        <h2 style={styles.titulo}>Historial de conversaciones</h2>
        {items.length === 0 ? (
          <p>No tienes conversaciones guardadas aún.</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {items.map((item) => (
                <li key={item.id} style={styles.card}>
                  <button
                    onClick={() => abrirChat(item)}
                    style={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      width: "100%",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <p style={styles.tituloChat}>{item.titulo}</p>
                    <p style={styles.fecha}>
                      {new Date(item.fecha).toLocaleDateString()} {" "}
                      {new Date(item.fecha).toLocaleTimeString()}
                    </p>
                  </button>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => renombrar(item)}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => eliminar(item.id)}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={eliminarTodo}
              style={{
                marginTop: 16,
                backgroundColor: colors.secundario,
                color: "#fff",
                padding: "10px 16px",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Eliminar todo el historial
            </button>
          </>
        )}
      </div>
    </>
  )
}
