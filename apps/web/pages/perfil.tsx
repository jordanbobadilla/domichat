import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { verificarSesion } from "../services/auth"
import { colors } from "../constants/colors"
import Header from "@/components/Header"

interface EstadoSuscripcion {
  activa: boolean
  expiracion?: string
}

export default function Perfil() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [token, setToken] = useState("")
  const [estado, setEstado] = useState<EstadoSuscripcion | null>(null)

  useEffect(() => {
    const sesion = verificarSesion()
    if (!sesion) return

    setToken(sesion.token)
    setNombre(sesion.nombre)

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
    router.push("/login")
  }

  return (
    <>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.avatar}>{nombre.charAt(0).toUpperCase()}</div>
          <h2 style={styles.titulo}>{nombre}</h2>

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

          <button style={styles.boton} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    maxWidth: 400,
    margin: "auto",
    paddingTop: "12vh",
    paddingLeft: 16,
    paddingRight: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    border: `1px solid ${colors.borde}`,
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: colors.primario,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 32,
    fontWeight: 700,
    margin: "0 auto 20px",
  },
  titulo: {
    fontSize: 22,
    color: colors.primario,
    marginBottom: 20,
    fontWeight: 700,
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
}
