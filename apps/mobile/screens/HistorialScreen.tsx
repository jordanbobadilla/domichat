import React from "react"
import { View, Text } from "react-native"

export default function HistorialScreen({ route }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>🧾 Historial (token: {route.params.token.slice(0, 10)}...)</Text>
    </View>
  )
}
