import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen"
import ChatScreen from "../screens/ChatScreen"

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
