import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { colors } from "../constants/colors"
import axios from "axios"
import { BASE_URL } from "../services/api"

export default function HistorialScreen({ navigation }: any) {
  const [historial, setHistorial] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [tituloEditando, setTituloEditando] = useState("")
  const [chatIdEditando, setChatIdEditando] = useState("")

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const token = await AsyncStorage.getItem("token")

        if (token) {
          const res = await axios.get(`${BASE_URL}/chat/historial`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const historialBack = res.data

          // Guardar también localmente para usar offline
          await AsyncStorage.setItem("historial", JSON.stringify(historialBack))

          setHistorial(historialBack)
        } else {
          // fallback: historial local si no hay token
          const local = await AsyncStorage.getItem("historial")
          if (local) setHistorial(JSON.parse(local))
        }
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
              const token = await AsyncStorage.getItem("token")

              if (token) {
                await axios.delete(`${BASE_URL}/chat/historial/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
              }

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

  const eliminarTodoElHistorial = () => {
    Alert.alert(
      "¿Eliminar todo?",
      "¿Estás seguro de que quieres borrar todas las conversaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todo",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("historial")
              setHistorial([])

              // 🔁 Eliminar en el backend también
              const token = await AsyncStorage.getItem("token")
              if (token) {
                await axios.delete(`${BASE_URL}/chat/historial/todo`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
              }
            } catch (error) {
              console.error("Error al eliminar todo el historial", error)
            }
          },
        },
      ]
    )
  }

  const abrirModalRenombrar = (id: string, tituloActual: string) => {
    setChatIdEditando(id)
    setTituloEditando(tituloActual)
    setModalVisible(true)
  }

  const guardarNuevoTitulo = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const prev = await AsyncStorage.getItem("historial")
      if (!prev) return

      const data = JSON.parse(prev)
      const actualizado = data.map((item: any) =>
        item.id === chatIdEditando ? { ...item, titulo: tituloEditando } : item
      )

      setHistorial(actualizado)
      await AsyncStorage.setItem("historial", JSON.stringify(actualizado))

      // 🔁 Actualizar en el backend
      if (token) {
        await axios.put(
          `${BASE_URL}/chat/historial/${chatIdEditando}`,
          { nuevoTitulo: tituloEditando },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (error) {
      console.error("Error al renombrar historial", error)
    } finally {
      setModalVisible(false)
    }
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
    <>
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
            <TouchableOpacity
              style={styles.botonEliminarTodo}
              onPress={eliminarTodoElHistorial}
            >
              <Text style={styles.textoEliminarTodo}>
                Eliminar todo el historial
              </Text>
            </TouchableOpacity>

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
            <TouchableOpacity
              style={styles.botonRenombrar}
              onPress={() => abrirModalRenombrar(item.id, item.titulo)}
            >
              <Text style={styles.textoRenombrar}>Renombrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Renombrar chat</Text>
            <TextInput
              style={styles.modalInput}
              value={tituloEditando}
              onChangeText={setTituloEditando}
              placeholder="Nuevo título"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ marginRight: 16, color: "#777" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={guardarNuevoTitulo}>
                <Text style={{ color: "#4285F4", fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  botonRenombrar: {
    marginTop: 6,
    backgroundColor: "#4285F4",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  textoRenombrar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalFondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContenido: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  botonEliminarTodo: {
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textoEliminarTodo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
})
