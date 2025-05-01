import React from "react"
import { View, Text, Button } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function PerfilScreen({ route, navigation }: any) {
  const cerrarSesion = async () => {
    await AsyncStorage.clear()
    navigation.replace("Login")
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>👤 Bienvenido, {route.params.nombre}</Text>
      <Button title="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  )
}
