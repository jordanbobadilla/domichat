// pages/index.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const [mostrar, setMostrar] = useState(false)

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

  return (
    <div style={styles.container}>
      <Image src="/logo.png" width={160} height={160} alt="DomiChat logo" />
      <h1 style={styles.titulo}>Bienvenido a DomiChat</h1>
      <p style={styles.subtitulo}>
        Tu asistente dominicano 🇩🇴 donde y cuando lo necesites
      </p>
      <button onClick={continuar} style={styles.boton}>
        Empezar
      </button>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: "2rem",
    color: "#0057A5",
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: "1rem",
    color: "#555",
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
  },
  boton: {
    backgroundColor: "#0057A5",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
}
