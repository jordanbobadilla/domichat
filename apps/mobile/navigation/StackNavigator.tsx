import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/LoginScreen"
import ChatScreen from "../screens/ChatScreen"
import { NavigationContainer } from "@react-navigation/native"

const Stack = createNativeStackNavigator()

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
