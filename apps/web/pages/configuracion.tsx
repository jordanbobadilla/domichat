import { useEffect, useState, useContext } from "react"
import Header from "@/components/Header"
import { temas } from "../constants/colors"
import { ThemeContext } from "../context/ThemeContext"

const VOCES = [
  { id: "popi", nombre: "Voz Popi (Distrito Nacional)" },
  { id: "wawawa", nombre: "Voz Wawawa (Santo Domingo Este/Oeste)" },
  { id: "cibaeña", nombre: "Voz Cibaeña (Santiago)" },
  { id: "sureña", nombre: "Voz Sureña (San José de Ocoa)" },
]

export default function Configuracion() {
  const [voz, setVoz] = useState("popi")
  const { tema, toggleTema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const v = localStorage.getItem("voz_dominicana")
    if (v) setVoz(v)
  }, [])

  const seleccionarVoz = (id: string) => {
    setVoz(id)
    localStorage.setItem("voz_dominicana", id)
  }

  const restaurarVoz = () => {
    setVoz("popi")
    localStorage.setItem("voz_dominicana", "popi")
  }

  const cambiarTema = () => {
    toggleTema()
  }

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      maxWidth: 500,
      margin: "auto",
      paddingTop: 70,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: colors.fondo,
    },
    titulo: {
      color: colors.primario,
      marginBottom: 20,
      textAlign: "center",
    },
    seccion: {
      marginBottom: 32,
    },
    subtitulo: {
      color: colors.texto,
      marginBottom: 12,
    },
    opcion: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "12px 16px",
      border: `1px solid ${colors.borde}`,
      borderRadius: 8,
      marginBottom: 8,
      cursor: "pointer",
      fontSize: 14,
      backgroundColor: colors.input,
      color: colors.texto,
    },
    botonSecundario: {
      backgroundColor: colors.primario,
      color: "#fff",
      padding: "10px 16px",
      border: "none",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      fontSize: 14,
      marginTop: 8,
    },
  }

  return (
    <>
      <div style={styles.wrapper}>
        <h2 style={styles.titulo}>Configuración</h2>

        <div style={styles.seccion}>
          <h3 style={styles.subtitulo}>Voz dominicana</h3>
          {VOCES.map((v) => (
            <button
              key={v.id}
              onClick={() => seleccionarVoz(v.id)}
              style={{
                ...styles.opcion,
                backgroundColor: voz === v.id ? colors.primario : "#fff",
                color: voz === v.id ? "#fff" : colors.texto,
              }}
            >
              {v.nombre}
            </button>
          ))}
          <button onClick={restaurarVoz} style={styles.botonSecundario}>
            Restaurar voz por defecto
          </button>
        </div>

        <div style={styles.seccion}>
          <h3 style={styles.subtitulo}>Tema</h3>
          <button onClick={cambiarTema} style={styles.botonSecundario}>
            Usar tema {tema === "oscuro" ? "claro" : "oscuro"}
          </button>
        </div>
      </div>
    </>
  )
}
