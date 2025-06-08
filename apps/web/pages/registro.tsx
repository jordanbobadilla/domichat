import { useForm } from "react-hook-form"
import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"
import { colors } from "../constants/colors"

interface FormValues {
  nombre: string
  email: string
  password: string
}

export default function Registro() {
  const { register, handleSubmit } = useForm<FormValues>()
  const router = useRouter()
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const onSubmit = async (data: FormValues) => {
    setError("")
    setCargando(true)

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/registro",
        data
      )
      const { token, usuario } = res.data

      localStorage.setItem("token", token)
      localStorage.setItem("nombre", usuario.nombre)
      localStorage.setItem("email", data.email)

      router.push("/chat")
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrarse")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.titulo}>Crear cuenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input
          type="text"
          placeholder="Nombre completo"
          {...register("nombre")}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
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
          {cargando ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <p style={styles.enlace}>
        ¿Ya tienes cuenta?{" "}
        <span onClick={() => router.push("/login")} style={styles.link}>
          Inicia sesión aquí
        </span>
      </p>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    maxWidth: 400,
    margin: "auto",
    paddingTop: "10vh",
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
