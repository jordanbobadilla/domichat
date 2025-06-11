import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { verificarSesion } from "../services/auth"
import { temas } from "../constants/colors"
import { ThemeContext } from "../context/ThemeContext"

interface EstadoSuscripcion {
  activa: boolean
  expiracion?: string
}

export default function Perfil() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [estado, setEstado] = useState<EstadoSuscripcion | null>(null)
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const sesion = verificarSesion()
    if (!sesion) return

    setNombre(sesion.nombre)
    if (sesion.email) setEmail(sesion.email)

    axios
      .get("http://localhost:4000/api/subscription/estado", {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
      .then((res) => setEstado(res.data))
      .catch(() => {})
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("nombre")
    localStorage.removeItem("email")
    router.push("/login")
  }

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 900,
      margin: "40px auto",
      paddingLeft: 24,
      paddingRight: 24,
    },
    header: {
      background: `linear-gradient(135deg, ${colors.primario}, ${colors.secundario})`,
      color: "#fff",
      borderRadius: "0 0 16px 16px",
      padding: "40px 32px",
      display: "flex",
      alignItems: "center",
      gap: 24,
    },
    content: {
      backgroundColor: colors.fondo,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      padding: 32,
      marginTop: -20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      backgroundColor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.primario,
      fontSize: 48,
      fontWeight: 700,
      flexShrink: 0,
      border: `4px solid ${colors.fondo}`,
    },
    titulo: {
      fontSize: 28,
      marginBottom: 4,
      fontWeight: 700,
      color: "#fff",
    },
    email: {
      color: "rgba(255,255,255,0.9)",
      marginBottom: 0,
      fontSize: 14,
    },
    bio: {
      color: colors.texto,
      marginBottom: 12,
      fontSize: 14,
    },
    info: {
      color: colors.texto,
      marginBottom: 8,
      fontSize: 14,
    },
    activa: {
      color: colors.exito,
      marginBottom: 24,
      fontSize: 16,
    },
    inactiva: {
      color: colors.texto,
      marginBottom: 24,
      fontSize: 16,
    },
    boton: {
      backgroundColor: colors.secundario,
      color: "#fff",
      padding: "12px 20px",
      border: "none",
      borderRadius: 10,
      fontWeight: 600,
      cursor: "pointer",
      fontSize: 16,
    },
    botonSecundario: {
      backgroundColor: colors.primario,
      color: "#fff",
      padding: "12px 20px",
      border: "none",
      borderRadius: 10,
      fontWeight: 600,
      cursor: "pointer",
      fontSize: 16,
      marginBottom: 12,
    },
  }

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.avatar}>{nombre.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={styles.titulo}>{nombre}</h2>
            {email && <p style={styles.email}>{email}</p>}
          </div>
        </div>
        <div style={styles.content}>
          <p style={styles.bio}>
            Apasionado por la tecnología y la cultura dominicana.
          </p>
          <p style={styles.info}>📍 Santo Domingo, RD</p>
          <p style={styles.info}>Miembro desde 2025</p>

            {estado ? (
              estado.activa ? (
                <p style={styles.activa}>
                  Suscripción activa hasta el{" "}
                  {new Date(estado.expiracion!).toLocaleDateString()}
                </p>
              ) : (
                <p style={styles.inactiva}>No tienes una suscripción activa</p>
              )
            ) : (
              <p style={{ color: colors.texto }}>
                Cargando estado de suscripción...
              </p>
            )}

          <button
            style={styles.botonSecundario}
            onClick={() => router.push("/configuracion")}
          >
            Configuración de DomiChat
          </button>

          <button style={styles.boton} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )
}
