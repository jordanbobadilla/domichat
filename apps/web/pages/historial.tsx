import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { temas } from "../constants/colors"
import { verificarSesion } from "../services/auth"
import { ThemeContext } from "../context/ThemeContext"
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5"

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
  const [isMobile, setIsMobile] = useState(true)
  const router = useRouter()
  const colors = temas[tema]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const sesion = verificarSesion()
    if (!sesion) return

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/chat/historial`, {
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
        `${process.env.NEXT_PUBLIC_API_URL}/chat/historial/${item.id}`,
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

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/historial/${id}`,
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      )

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

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/historial/todo`,
        {
          headers: { Authorization: `Bearer ${sesion.token}` },
        }
      )
      setItems([])
    } catch (err) {
      console.error(err)
    }
  }

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 800,
      margin: "auto",
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: colors.fondo,
    },
    header: {
      background: `linear-gradient(135deg, ${colors.primario}, ${colors.secundario})`,
      color: "#fff",
      borderRadius: "0 0 16px 16px",
      padding: "32px 24px",
      marginLeft: -16,
      marginRight: -16,
    },
    titulo: {
      fontWeight: 700,
      paddingLeft: isMobile ? 48 : 0,
      fontSize: 20,
    },
    content: {
      marginTop: 20,
    },
    card: {
      backgroundColor: colors.input,
      border: `1px solid ${colors.borde}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
    },
    info: {
      flex: 1,
    },
    tituloChat: {
      fontWeight: 600,
      marginBottom: 4,
      fontSize: 16,
      color: colors.texto,
    },
    fecha: {
      color: colors.gris,
      fontSize: 14,
    },
    acciones: {
      display: "flex",
      gap: 8,
    },
    icono: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: colors.primario,
      fontSize: 20,
    },
  }

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.titulo}>Historial de conversaciones</h2>
        </div>
        <div style={styles.content}>
          {items.length === 0 ? (
            <p>No tienes conversaciones guardadas aún.</p>
          ) : (
            <>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {items.map((item) => (
                  <li
                    key={item.id}
                    style={styles.card}
                    onClick={() => abrirChat(item)}
                >
                  <div style={styles.info}>
                    <p style={styles.tituloChat}>{item.titulo}</p>
                    <p style={styles.fecha}>
                      {new Date(item.fecha).toLocaleDateString()}{" "}
                      {new Date(item.fecha).toLocaleTimeString()}
                    </p>
                  </div>
                  <div style={styles.acciones}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        renombrar(item)
                      }}
                      style={styles.icono}
                    >
                      <IoPencilOutline />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        eliminar(item.id)
                      }}
                      style={styles.icono}
                    >
                      <IoTrashOutline />
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
      </div>
    </>
  )
}
