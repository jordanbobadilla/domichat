import Link from "next/link"
import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { temas } from "../constants/colors"
import { ThemeContext } from "../context/ThemeContext"

export default function Header() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  const styles: { [key: string]: React.CSSProperties } = {
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: colors.primario,
      borderBottom: `1px solid ${colors.primario}`,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: 800,
      margin: "auto",
      width: "100%",
      boxSizing: "border-box",
    },
    left: {
      display: "flex",
      gap: 16,
    },
    link: {
      color: "#fff",
      fontWeight: 600,
      textDecoration: "none",
      fontSize: 16,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    nombre: {
      color: "#fff",
      fontSize: 15,
    },
    boton: {
      backgroundColor: colors.secundario,
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "8px 14px",
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  useEffect(() => {
    const n = localStorage.getItem("nombre")
    if (n) setNombre(n)
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("nombre")
    router.push("/login")
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link href="/chat" style={styles.link}>
          Chat
        </Link>
        <Link href="/historial" style={styles.link}>
          Historial
        </Link>
        <Link href="/perfil" style={styles.link}>
          Perfil
        </Link>
        <Link href="/configuracion" style={styles.link}>
          Configuración
        </Link>
      </div>

      <div style={styles.right}>
        <span style={styles.nombre}>{nombre}</span>
        <button onClick={cerrarSesion} style={styles.boton}>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
