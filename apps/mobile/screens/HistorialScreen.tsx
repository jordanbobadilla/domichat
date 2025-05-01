import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { getHistorial } from "../services/api"
import { colors } from "../constants/colors"

export default function HistorialScreen({ route }: any) {
  const { token } = route.params
  const [historial, setHistorial] = useState<
    { mensaje: string; respuesta: string; creadoEn: string }[]
  >([])
  const [cargando, setCargando] = useState(true)

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
        <ActivityIndicator size="large" color={colors.primario} />
        <Text style={{ marginTop: 10, color: colors.texto }}>
          Cargando historial...
        </Text>
      </View>
    )
  }

  if (historial.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.texto }}>
          No tienes conversaciones guardadas aún.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {historial.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.fecha}>
            {new Date(item.creadoEn).toLocaleString()}
          </Text>
          <Text style={styles.usuario}>🧑 Tú:</Text>
          <Text style={styles.mensaje}>{item.mensaje}</Text>
          <Text style={styles.bot}>🤖 DomiChat:</Text>
          <Text style={styles.respuesta}>{item.respuesta}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 64,
    backgroundColor: colors.fondo,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: colors.borde,
    borderWidth: 1,
  },
  usuario: {
    fontWeight: "600",
    color: colors.primario,
    marginTop: 5,
  },
  bot: {
    fontWeight: "600",
    color: colors.texto,
    marginTop: 8,
  },
  mensaje: {
    color: colors.texto,
    marginBottom: 4,
  },
  respuesta: {
    color: "#444",
    marginBottom: 2,
  },
  fecha: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
})
