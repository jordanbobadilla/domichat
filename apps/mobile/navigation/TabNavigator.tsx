import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatScreen from "../screens/ChatScreen"
import HistorialScreen from "../screens/HistorialScreen"
import PerfilScreen from "../screens/PerfilScreen"

const Tab = createBottomTabNavigator()

export default function TabNavigator({
  token,
  nombre,
}: {
  token: string
  nombre: string
}) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chat">
        {(props) => (
          <ChatScreen {...props} route={{ params: { token, nombre } }} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Historial">
        {(props) => (
          <HistorialScreen {...props} route={{ params: { token } }} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Perfil">
        {(props) => <PerfilScreen {...props} route={{ params: { nombre } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
