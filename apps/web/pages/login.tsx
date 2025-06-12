import { useForm } from "react-hook-form"
import axios from "axios"
import { useRouter } from "next/router"
import { useState, useContext } from "react"
import { temas } from "../constants/colors"
import { ThemeContext } from "../context/ThemeContext"
import { IoLogInOutline } from "react-icons/io5"
import Image from "next/image"

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<FormValues>()
  const router = useRouter()
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  const onSubmit = async (data: FormValues) => {
    setError("")
    setCargando(true)

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data
      ) // Reemplaza si usas ngrok
      const { token, usuario } = res.data

      // Guardar en localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("nombre", usuario.nombre)
      localStorage.setItem("email", data.email)

      // Redirigir al chat
      router.push("/chat")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al iniciar sesión")
      } else {
        setError("Error al iniciar sesión")
      }
    } finally {
      setCargando(false)
    }
  }

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 400,
      margin: "auto",
      paddingTop: "12vh",
      paddingLeft: 16,
      paddingRight: 16,
    },
    titulo: {
      color: colors.primario,
      textAlign: "center",
      marginBottom: 30,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    input: {
      padding: "12px",
      fontSize: 16,
      border: `1px solid ${colors.borde}`,
      borderRadius: 8,
      backgroundColor: colors.input,
      color: colors.texto,
    },
    boton: {
      backgroundColor: colors.primario,
      color: "#fff",
      padding: "12px",
      border: "none",
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 16,
      cursor: "pointer",
    },
    error: {
      color: colors.secundario,
      marginTop: 16,
      textAlign: "center",
    },
    enlace: {
      marginTop: 24,
      textAlign: "center",
      color: colors.texto,
    },
    link: {
      color: colors.primario,
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  return (
    <div style={styles.wrapper}>
      <Image
        src="/domichat-logo.svg"
        width={120}
        height={120}
        alt="DomiChat logo"
        style={{ display: "block", margin: "0 auto 20px" }}
      />
      <h2 style={styles.titulo}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input
          type="email"
          placeholder="Correo"
          {...register("email")}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          {...register("password")}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.boton}>
          {cargando ? (
            "Entrando..."
          ) : (
            <>
              <IoLogInOutline
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              Entrar
            </>
          )}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <p style={styles.enlace}>
        ¿No tienes cuenta?{" "}
        <span onClick={() => router.push("/registro")} style={styles.link}>
          Crea una aquí
        </span>
      </p>
    </div>
  )
}
