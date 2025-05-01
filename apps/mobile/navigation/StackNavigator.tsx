import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen"
import TabNavigator from "./TabNavigator"
import { ROUTES } from "../constants/routes"
import RegisterScreen from "../screens/RegisterScreen"

const Stack = createNativeStackNavigator()

export default function StackNavigator({
  token,
  nombre,
}: {
  token: string | null
  nombre: string | null
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.MAIN_TABS}>
          {(props) => <TabNavigator {...props} />}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
