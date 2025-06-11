import { useEffect, useState, useRef, useContext } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { temas } from "../constants/colors"
import { verificarSesion } from "../services/auth"
import { ThemeContext } from "../context/ThemeContext"
import ReactMarkdown from "react-markdown"
import { guardarHistorial } from "../services/chat"
import { IoAddCircleOutline, IoSend } from "react-icons/io5"

interface Mensaje {
  mensaje: string
  respuesta: string
  creadoEn: string
}

export default function Chat() {
  const router = useRouter()
  const {
    mensajePrevio = "",
    respuestaPrevio = "",
    historial: historialQuery = "",
  } = router.query as {
    mensajePrevio?: string
    respuestaPrevio?: string
    historial?: string
  }

  const historialInicial: Mensaje[] | (() => Mensaje[]) = historialQuery
    ? JSON.parse(decodeURIComponent(historialQuery as string))
    : mensajePrevio && respuestaPrevio
    ? [
        {
          mensaje: decodeURIComponent(mensajePrevio as string),
          respuesta: decodeURIComponent(respuestaPrevio as string),
          creadoEn: new Date().toISOString(),
        },
      ]
    : []

  const [nombre, setNombre] = useState("")
  const [token, setToken] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [historial, setHistorial] = useState<Mensaje[]>(historialInicial)
  const [cargando, setCargando] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const chatRef = useRef<HTMLDivElement>(null)
  const { tema } = useContext(ThemeContext)
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

    setToken(sesion.token)
    setNombre(sesion.nombre)

    if (!historialQuery && !mensajePrevio && !respuestaPrevio) {
      axios
        .get("http://localhost:4000/api/chat/activo", {
          headers: { Authorization: `Bearer ${sesion.token}` },
        })
        .then((r) => setHistorial(r.data))
        .catch(() => {})

      const ev = new EventSource(
        `http://localhost:4000/api/chat/stream?token=${sesion.token}`
      )
      ev.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.tipo === "mensaje") {
          setHistorial((h) => [...h, data.mensaje])
        } else if (data.tipo === "reset") {
          setHistorial([])
        }
      }
      return () => {
        ev.close()
      }
    } else {
      setHistorial(historialInicial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historialQuery, mensajePrevio, respuestaPrevio])

  useEffect(() => {
    localStorage.setItem("chat_activo", JSON.stringify(historial))
  }, [historial])

  function modificarRespuestaSegunVoz(texto: string, voz: string): string {
    switch (voz) {
      case "popi":
        return texto
      case "wawawa":
        return texto
          .replace(/¿/g, "")
          .replace(/\?/g, "")
          .replace(/s /g, " e ")
          .replace(/tú/g, "tú men")
          .replace(/\./g, " loco.")
      case "cibaeña":
        return texto.replace(/r\b/g, "i").replace(/l\b/g, "i")
      case "sureña":
        return texto.replace(/s/g, "h").replace(/r\b/g, "l")
      default:
        return texto
    }
  }

  function hablar(texto: string) {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(texto)
      utter.lang = "es-DO"
      utter.rate = 1.0
      window.speechSynthesis.speak(utter)
    }
  }
  const enviarMensaje = async () => {
    if (!mensaje.trim()) return

    setCargando(true)
    try {
      const res = await axios.post(
        "http://localhost:4000/api/chat",
        { mensaje },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const voz = localStorage.getItem("voz_dominicana") || "popi"
      const respuestaAdaptada = modificarRespuestaSegunVoz(
        res.data.respuesta,
        voz
      )

      // La respuesta llegará vía SSE

      // Hablar
      hablar(respuestaAdaptada)
      setMensaje("")

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        })
      }, 200)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const nuevoChat = async () => {
    if (historial.length > 0) {
      try {
        await guardarHistorial(token, historial)
      } catch (err) {
        console.error(err)
      }
    }
    setHistorial([])
  }

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 800,
      margin: "auto",
      paddingTop: 24,
      paddingLeft: 16,
      paddingRight: 16,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      boxSizing: "border-box",
      backgroundColor: colors.fondo,
    },
    titulo: {
      color: colors.primario,
      fontWeight: 700,
    },
    tituloRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      paddingLeft: isMobile ? 64 : 0,
    },
    botonNuevo: {
      backgroundColor: colors.secundario,
      color: "#fff",
      border: "none",
      padding: "8px 12px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
    },
    chatBox: {
      flex: 1,
      overflowY: "auto",
      paddingBottom: 100,
    },
    card: {
      backgroundColor: colors.input,
      border: `1px solid ${colors.borde}`,
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
    },
    etiquetaUsuario: {
      color: colors.primario,
      fontWeight: 600,
      marginBottom: 4,
    },
    etiquetaBot: {
      color: colors.texto,
      fontWeight: 600,
      marginTop: 10,
    },
    mensaje: {
      color: colors.texto,
      marginBottom: 6,
    },
    respuesta: {
      color: colors.texto,
    },
    mensajeUsuario: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
      alignSelf: "flex-end",
      maxWidth: 250,
      width: "fit-content",
      display: "inline-block",
    },
    mensajeBot: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    inputBox: {
      display: "flex",
      gap: 8,
      padding: "10px 16px",
      borderTop: `1px solid ${colors.borde}`,
      position: "fixed",
      bottom: 0,
      left: isMobile ? 0 : 220,
      right: 0,
      backgroundColor: colors.fondo,
      maxWidth: 800,
      margin: "auto",
      width: "100%",
      boxSizing: "border-box",
    },
    input: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      borderRadius: 8,
      border: `1px solid ${colors.borde}`,
      backgroundColor: colors.input,
      color: colors.texto,
    },
    boton: {
      backgroundColor: colors.primario,
      color: "#fff",
      border: "none",
      padding: "12px 20px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
    },
    emptyContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
    },
    emptyTitulo: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 12,
      textAlign: "center",
      color: colors.texto,
    },
    emptyTexto: {
      fontSize: 14,
      textAlign: "center",
      lineHeight: "20px",
      color: colors.gris,
    },
  }

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.tituloRow}>
          <h2 style={styles.titulo}>Hola, {nombre.split(" ")[0]} 👋</h2>
          <button onClick={nuevoChat} style={styles.botonNuevo}>
            <IoAddCircleOutline
              style={{ marginRight: 6, verticalAlign: "middle" }}
            />
            Nuevo chat
          </button>
        </div>

        {historial.length === 0 ? (
          <div style={styles.emptyContainer}>
            <h3 style={styles.emptyTitulo}>¡Bienvenido a DomiChat!</h3>
            <p style={styles.emptyTexto}>
              Comienza escribiendo tu primera pregunta o mensaje.
            </p>
          </div>
        ) : (
          <div ref={chatRef} style={styles.chatBox}>
            {historial.map((h, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    ...styles.mensajeUsuario,
                    backgroundColor:
                      i % 2 === 0 ? colors.primario : colors.secundario,
                  }}
                >
                  <p style={{ color: "#fff", margin: 0 }}>{h.mensaje}</p>
                </div>
                <div style={styles.mensajeBot}>
                  <div style={{ color: "#000" }}>
                    <ReactMarkdown>{h.respuesta}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.inputBox}>
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            style={styles.input}
          />
          <button onClick={enviarMensaje} style={styles.boton}>
            {cargando ? (
              "..."
            ) : (
              <>
                <IoSend style={{ marginRight: 4, verticalAlign: "middle" }} />
                Enviar
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
