import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import StackNavigator from "./navigation/StackNavigator"
import { ThemeProvider } from "./context/ThemeContext"

export default function App() {
  const [cargando, setCargando] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [nombre, setNombre] = useState<string | null>(null)

  useEffect(() => {
    const verificarSesion = async () => {
      const t = await AsyncStorage.getItem("token")
      const n = await AsyncStorage.getItem("nombre")
      setToken(t)
      setNombre(n)
      setCargando(false)
    }
    verificarSesion()
  }, [])

  if (cargando) return null

  return (
    <ThemeProvider>
      <StackNavigator token={token} nombre={nombre} />
    </ThemeProvider>
  )
}
