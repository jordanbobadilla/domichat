import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { ROUTES } from "../constants/routes"
import { colors } from "../constants/colors"
import ChatScreen from "../screens/ChatScreen"
import HistorialScreen from "../screens/HistorialScreen"
import PerfilScreen from "../screens/PerfilScreen"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Tab = createBottomTabNavigator()

export default function TabNavigator({ route }: any) {
  const { token, nombre } = route.params
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: colors.borde,
          elevation: 10,
          height: 70 + insets.bottom, // <- Aumentamos dinámicamente
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 6,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap =
            "chatbubble-ellipses-outline"

          if (route.name === ROUTES.HISTORIAL) iconName = "time-outline"
          if (route.name === ROUTES.PERFIL) iconName = "person-circle-outline"

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name={ROUTES.CHAT} options={{ title: "Chat" }}>
        {(props) => (
          <ChatScreen {...props} route={{ params: { token, nombre } }} />
        )}
      </Tab.Screen>

      <Tab.Screen name={ROUTES.HISTORIAL} options={{ title: "Historial" }}>
        {(props) => (
          <HistorialScreen {...props} route={{ params: { token } }} />
        )}
      </Tab.Screen>

      <Tab.Screen name={ROUTES.PERFIL} options={{ title: "Perfil" }}>
        {(props) => <PerfilScreen {...props} route={{ params: { nombre } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
