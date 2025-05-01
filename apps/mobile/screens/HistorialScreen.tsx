import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { getHistorial } from "../services/api"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native"

export default function HistorialScreen({ route }: any) {
  const { token } = route.params
  const [historial, setHistorial] = useState<
    { mensaje: string; respuesta: string; creadoEn: string }[]
  >([])
  const [cargando, setCargando] = useState(true)
  const navigation = useNavigation<any>()

  useEffect(() => {
    async function cargarHistorial() {
      try {
        const data = await getHistorial(token)
        setHistorial(data.historial)
      } catch (error) {
        console.error("Error cargando historial", error)
      } finally {
        setCargando(false)
      }
    }

    cargarHistorial()
  }, [])

  if (cargando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={{ marginTop: 10 }}>Cargando historial...</Text>
      </View>
    )
  }

  if (historial.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No tienes conversaciones guardadas aún.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {historial.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() =>
            navigation.navigate("Chat", {
              mensajePrevio: item.mensaje,
              respuestaPrevio: item.respuesta,
            })
          }
        >
          <Text style={styles.fecha}>
            {new Date(item.creadoEn).toLocaleString()}
          </Text>
          <Text style={styles.mensaje}>🧑 Tú: {item.mensaje}</Text>
          <Text style={styles.respuesta}>🤖 DomiChat: {item.respuesta}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: {
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  mensaje: { fontWeight: "600", marginBottom: 5 },
  respuesta: { color: "#444" },
  fecha: { fontSize: 12, color: "#888", marginBottom: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
})
