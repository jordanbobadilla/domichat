import { useEffect, useState, useRef, useContext } from "react"
import axios from "axios"
import { temas } from "../constants/colors"
import { verificarSesion } from "../services/auth"
import Header from "../components/Header"
import { ThemeContext } from "../context/ThemeContext"
import ReactMarkdown from "react-markdown"

interface Mensaje {
  mensaje: string
  respuesta: string
  creadoEn: string
}

export default function Chat() {
  const [nombre, setNombre] = useState("")
  const [token, setToken] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [historial, setHistorial] = useState<Mensaje[]>([])
  const [cargando, setCargando] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const sesion = verificarSesion()
    if (!sesion) return

    setToken(sesion.token)
    setNombre(sesion.nombre)

    axios
      .get("http://localhost:4000/api/chat/historial", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((res) => setHistorial(res.data))
      .catch(() => {})
  }, [])

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

      // Agregar al historial
      setHistorial([
        ...historial,
        {
          mensaje,
          respuesta: respuestaAdaptada,
          creadoEn: new Date().toISOString(),
        },
      ])

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

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 800,
      margin: "auto",
      paddingTop: 30,
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
      marginBottom: 20,
    },
    chatBox: {
      flex: 1,
      overflowY: "auto",
      paddingBottom: 20,
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
    },
    mensajeBot: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    inputBox: {
      display: "flex",
      gap: 8,
      paddingTop: 10,
      borderTop: `1px solid ${colors.borde}`,
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
  }

  return (
    <>
      <Header />
      <div style={styles.wrapper}>
        <h2 style={styles.titulo}>Hola, {nombre.split(" ")[0]} 👋</h2>

        <div ref={chatRef} style={styles.chatBox}>
          {historial.map((h, i) => (
            <div key={i}>
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

        <div style={styles.inputBox}>
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            style={styles.input}
          />
          <button onClick={enviarMensaje} style={styles.boton}>
            {cargando ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </>
  )
}
