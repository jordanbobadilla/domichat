import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import {
  IoChatbubbleEllipsesOutline,
  IoTimeOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5"

export default function Sidebar() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const n = localStorage.getItem("nombre")
    if (n) setNombre(n)
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("nombre")
    router.push("/login")
  }

  const styles: { [key: string]: React.CSSProperties } = {
    sidebar: {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      width: 220,
      backgroundColor: colors.primario,
      color: "#fff",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      fontWeight: 600,
      padding: "8px 12px",
      borderRadius: 6,
    },
    bottom: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    nombre: {
      color: "#fff",
      fontSize: 14,
    },
    boton: {
      backgroundColor: colors.secundario,
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 12px",
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        <Link href="/chat" style={styles.link}>
          <IoChatbubbleEllipsesOutline style={{ marginRight: 6 }} /> Nuevo chat
        </Link>
        <Link href="/historial" style={styles.link}>
          <IoTimeOutline style={{ marginRight: 6 }} /> Historial
        </Link>
        <Link href="/perfil" style={styles.link}>
          <IoPersonCircleOutline style={{ marginRight: 6 }} /> Perfil
        </Link>
        <Link href="/configuracion" style={styles.link}>
          <IoSettingsOutline style={{ marginRight: 6 }} /> Configuración
        </Link>
      </nav>
      <div style={styles.bottom}>
        <span style={styles.nombre}>{nombre}</span>
        <button onClick={cerrarSesion} style={styles.boton}>
          <IoLogOutOutline style={{ marginRight: 6 }} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
