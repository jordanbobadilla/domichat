import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { ROUTES } from "../constants/routes"
import ChatScreen from "../screens/ChatScreen"
import HistorialScreen from "../screens/HistorialScreen"
import PerfilScreen from "../screens/PerfilScreen"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

const Tab = createBottomTabNavigator()

export default function TabNavigator({ route }: any) {
  const { token, nombre } = route.params
  const insets = useSafeAreaInsets()
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.gris,
        tabBarStyle: {
          backgroundColor: colors.fondo,
          borderTopWidth: 1,
          borderTopColor: colors.gris,
          elevation: 10,
          height: 70 + insets.bottom,
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
      <Tab.Screen
        name={ROUTES.CHAT}
        component={ChatScreen}
        initialParams={{ token, nombre }}
      />
      <Tab.Screen
        name={ROUTES.HISTORIAL}
        component={HistorialScreen}
        initialParams={{ token }}
      />
      <Tab.Screen
        name={ROUTES.PERFIL}
        component={PerfilScreen}
        initialParams={{ token, nombre }}
      />
    </Tab.Navigator>
  )
}
