// pages/index.tsx
import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import { IoArrowForwardOutline } from "react-icons/io5"

export default function Home() {
  const router = useRouter()
  const [mostrar, setMostrar] = useState(false)
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const yaVisto = localStorage.getItem("welcome_shown")
    const token = localStorage.getItem("token")

    if (yaVisto === "true") {
      router.replace(token ? "/chat" : "/login")
    } else {
      setMostrar(true)
    }
  }, [])

  const continuar = () => {
    localStorage.setItem("welcome_shown", "true")
    const token = localStorage.getItem("token")
    router.replace(token ? "/chat" : "/login")
  }

  if (!mostrar) return null

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: colors.fondo,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    titulo: {
      fontSize: "2rem",
      color: colors.primario,
      fontWeight: "bold",
      marginTop: 20,
      textAlign: "center",
    },
    subtitulo: {
      fontSize: "1rem",
      color: colors.gris,
      marginTop: 10,
      marginBottom: 30,
      textAlign: "center",
    },
    boton: {
      backgroundColor: colors.primario,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: 10,
      border: "none",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  return (
    <div style={styles.container}>
      <Image src="/domichat-logo.svg" width={160} height={160} alt="DomiChat logo" />
      <h1 style={styles.titulo}>Bienvenido a DomiChat</h1>
      <p style={styles.subtitulo}>
        Tu asistente dominicano 🇩🇴 donde y cuando lo necesites
      </p>
      <button onClick={continuar} style={styles.boton}>
        Empezar <IoArrowForwardOutline style={{ marginLeft: 6 }} />
      </button>
    </div>
  )
}
