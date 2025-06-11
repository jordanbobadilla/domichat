import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import Image from "next/image"
import {
  IoChatbubbleEllipsesOutline,
  IoTimeOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoCloseOutline,
} from "react-icons/io5"

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
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

  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
      transform:
        isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
      transition: "transform 0.3s ease-in-out",
      zIndex: 1000,
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
    logo: {
      display: "block",
      margin: "0 auto 20px",
      background: colors.fondo,
      borderRadius: 16,
    },
    bottom: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    nombre: {
      color: "#fff",
      fontSize: 14,
      alignSelf: "center",
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
      <IoCloseOutline
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          cursor: "pointer",
          display: isMobile ? "block" : "none",
        }}
      />
      <Image
        src="/domichat-logo.svg"
        width={120}
        height={120}
        alt="DomiChat logo"
        style={styles.logo}
      />
      <nav style={styles.nav}>
        <Link href="/chat" style={styles.link}>
          <IoChatbubbleEllipsesOutline
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Nuevo chat
        </Link>
        <Link href="/historial" style={styles.link}>
          <IoTimeOutline style={{ marginRight: 6, verticalAlign: "middle" }} />
          Historial
        </Link>
        <Link href="/perfil" style={styles.link}>
          <IoPersonCircleOutline
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Perfil
        </Link>
        <Link href="/configuracion" style={styles.link}>
          <IoSettingsOutline
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Configuración
        </Link>
      </nav>
      <div style={styles.bottom}>
        <span style={styles.nombre}>{nombre}</span>
        <button onClick={cerrarSesion} style={styles.boton}>
          <IoLogOutOutline
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
