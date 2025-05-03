import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen"
import TabNavigator from "./TabNavigator"
import { ROUTES } from "../constants/routes"
import RegisterScreen from "../screens/RegisterScreen"
import WelcomeScreen from "../screens/WelcomeScreen"
import VozTutorialScreen from "../screens/VozTutorialScreen"

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
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen
          name={ROUTES.VOZ_TUTORIAL}
          component={VozTutorialScreen}
        />
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ROUTES.MAIN_TABS}>
          {(props) => <TabNavigator {...props} />}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
