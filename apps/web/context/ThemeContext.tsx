import React, { createContext, useEffect, useState, ReactNode } from "react"
import { temas, Tema } from "../constants/colors"

interface ThemeContextType {
  tema: Tema
  toggleTema: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  tema: "claro",
  toggleTema: () => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [tema, setTema] = useState<Tema>("claro")

  useEffect(() => {
    const t = localStorage.getItem("tema") as Tema | null
    if (t === "oscuro") setTema("oscuro")
  }, [])

  useEffect(() => {
    const colors = temas[tema]
    Object.entries(colors).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--${k}`, v)
    })
    document.documentElement.style.setProperty("--background", colors.fondo)
    document.documentElement.style.setProperty("--foreground", colors.texto)
  }, [tema])

  const toggleTema = () => {
    const nuevo = tema === "oscuro" ? "claro" : "oscuro"
    setTema(nuevo)
    localStorage.setItem("tema", nuevo)
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}
