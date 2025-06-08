import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { colors } from "../constants/colors"

export default function Header() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")

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

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: "#fff",
    borderBottom: `1px solid ${colors.borde}`,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    display: "flex",
    gap: 16,
  },
  link: {
    color: colors.primario,
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
    color: colors.texto,
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
