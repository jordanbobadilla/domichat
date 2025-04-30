import { useEffect, useState } from "react"
import StackNavigator from "./navigation/StackNavigator"
import { NavigationContainer } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "./screens/LoginScreen"
import ChatScreen from "./screens/ChatScreen"

const Stack = createNativeStackNavigator()

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token && nombre ? (
          <Stack.Screen name="Chat">
            {(props) => (
              <ChatScreen {...props} route={{ params: { token, nombre } }} />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
