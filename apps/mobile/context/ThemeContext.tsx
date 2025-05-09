import React, { createContext, useEffect, useState, ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeType = "claro" | "oscuro"

interface ThemeContextType {
  tema: ThemeType
  toggleTema: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  tema: "claro",
  toggleTema: () => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [tema, setTema] = useState<ThemeType>("claro")

  useEffect(() => {
    AsyncStorage.getItem("tema").then((t) => {
      if (t === "oscuro") setTema("oscuro")
    })
  }, [])

  const toggleTema = async () => {
    const nuevo = tema === "oscuro" ? "claro" : "oscuro"
    setTema(nuevo)
    await AsyncStorage.setItem("tema", nuevo)
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}
