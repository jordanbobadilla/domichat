import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import ChatScreen from "../screens/ChatScreen"
import HistorialScreen from "../screens/HistorialScreen"
import PerfilScreen from "../screens/PerfilScreen"
import { ROUTES } from "../constants/routes"

const Tab = createBottomTabNavigator()

export default function TabNavigator({ route }: any) {
  const { token, nombre } = route.params
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={ROUTES.CHAT}>
        {(props) => (
          <ChatScreen {...props} route={{ params: { token, nombre } }} />
        )}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.HISTORIAL}>
        {(props) => (
          <HistorialScreen {...props} route={{ params: { token } }} />
        )}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.PERFIL}>
        {(props) => <PerfilScreen {...props} route={{ params: { nombre } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
