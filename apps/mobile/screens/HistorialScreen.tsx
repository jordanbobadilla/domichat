import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { colors } from "../constants/colors"

export default function HistorialScreen({ navigation }: any) {
  const [historial, setHistorial] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await AsyncStorage.getItem("historial")
        if (data) setHistorial(JSON.parse(data))
      } catch (error) {
        console.error("Error cargando historial", error)
      } finally {
        setCargando(false)
      }
    }

    cargarHistorial()
  }, [])

  const eliminarHistorial = (id: string) => {
    Alert.alert(
      "¿Eliminar chat?",
      "¿Estás seguro de que quieres eliminar esta conversación del historial?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const prev = await AsyncStorage.getItem("historial")
              if (prev) {
                const data = JSON.parse(prev)
                const nuevoHistorial = data.filter(
                  (item: any) => item.id !== id
                )
                setHistorial(nuevoHistorial)
                await AsyncStorage.setItem(
                  "historial",
                  JSON.stringify(nuevoHistorial)
                )
              }
            } catch (error) {
              console.error("Error eliminando historial", error)
            }
          },
        },
      ]
    )
  }

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
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={async () => {
            const token = await AsyncStorage.getItem("token")
            navigation.navigate("ChatScreen", {
              token,
              mensajePrevio: item.mensajes[0]?.mensaje,
              respuestaPrevio: item.mensajes[0]?.respuesta,
            })
          }}
        >
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.fecha}>
            {new Date(item.fecha).toLocaleDateString()}{" "}
            {new Date(item.fecha).toLocaleTimeString()}
          </Text>

          <TouchableOpacity
            style={styles.botonEliminar}
            onPress={() => eliminarHistorial(item.id)}
          >
            <Text style={styles.textoEliminar}>Eliminar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  fecha: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  botonEliminar: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  textoEliminar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
})
