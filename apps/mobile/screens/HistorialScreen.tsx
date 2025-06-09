import React, { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { BASE_URL } from "../services/api"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import Header from "../components/Header"

export default function HistorialScreen({ navigation }: any) {
  const [historial, setHistorial] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [chatIdEditando, setChatIdEditando] = useState("")
  const [tituloEditando, setTituloEditando] = useState("")
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    cargarHistorial()
  }, [])

  const cargarHistorial = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        const res = await axios.get(`${BASE_URL}/chat/historial`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setHistorial(res.data)
        await AsyncStorage.setItem("historial", JSON.stringify(res.data))
      } else {
        const local = await AsyncStorage.getItem("historial")
        if (local) setHistorial(JSON.parse(local))
      }
    } catch (error) {
      console.error("Error cargando historial", error)
    } finally {
      setCargando(false)
    }
  }

  const eliminarHistorial = (id: string) => {
    Alert.alert("¿Eliminar chat?", "Esto no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token")
          const nuevoHistorial = historial.filter((item) => item.id !== id)
          setHistorial(nuevoHistorial)
          await AsyncStorage.setItem(
            "historial",
            JSON.stringify(nuevoHistorial)
          )

          if (token) {
            await axios.delete(`${BASE_URL}/chat/historial/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          }
        },
      },
    ])
  }

  const renombrarHistorial = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const actualizado = historial.map((item) =>
        item.id === chatIdEditando ? { ...item, titulo: tituloEditando } : item
      )
      setHistorial(actualizado)
      await AsyncStorage.setItem("historial", JSON.stringify(actualizado))

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

  const eliminarTodoElHistorial = () => {
    Alert.alert("¿Eliminar todo?", "Esto borrará todos tus chats guardados.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar todo",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("historial")
          setHistorial([])

          const token = await AsyncStorage.getItem("token")
          if (token) {
            await axios.delete(`${BASE_URL}/chat/historial/todo`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          }
        },
      },
    ])
  }

  if (cargando) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.fondo }]}>
        <Header titulo="Historial" />
        <ActivityIndicator size="large" color={colors.primario} />
        <Text style={{ marginTop: 10, color: colors.texto }}>
          Cargando historial...
        </Text>
      </View>
    )
  }

  if (historial.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.fondo }]}>
        <Header titulo="Historial" />
        <Text style={{ color: colors.texto }}>
          No tienes conversaciones guardadas aún.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={{ backgroundColor: colors.fondo, padding: 16 }}>
      <Header titulo="Historial" />
      {historial.map((item) => (
        <View
          key={item.id}
          style={[styles.card, { backgroundColor: colors.secundario }]}
        >
          <TouchableOpacity
            onPress={async () => {
              const token = await AsyncStorage.getItem("token")
              navigation.navigate("ChatScreen", {
                token,
                mensajePrevio: item.mensajes[0]?.mensaje,
                respuestaPrevio: item.mensajes[0]?.respuesta,
              })
            }}
          >
            <Text style={[styles.titulo, { color: colors.texto }]}>
              {item.titulo}
            </Text>
            <Text style={[styles.fecha, { color: colors.gris }]}>
              {new Date(item.fecha).toLocaleDateString()}{" "}
              {new Date(item.fecha).toLocaleTimeString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, { backgroundColor: colors.primario }]}
            onPress={() => {
              setChatIdEditando(item.id)
              setTituloEditando(item.titulo)
              setModalVisible(true)
            }}
          >
            <Text style={styles.textoBoton}>Renombrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, { backgroundColor: colors.peligro }]}
            onPress={() => eliminarHistorial(item.id)}
          >
            <Text style={styles.textoBoton}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.botonReset, { backgroundColor: colors.gris }]}
        onPress={eliminarTodoElHistorial}
      >
        <Text style={styles.textoBoton}>Eliminar todo el historial</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalFondo}>
          <View
            style={[styles.modalContenido, { backgroundColor: colors.fondo }]}
          >
            <Text style={[styles.modalTitulo, { color: colors.texto }]}>
              Renombrar
            </Text>
            <TextInput
              value={tituloEditando}
              onChangeText={setTituloEditando}
              style={[
                styles.modalInput,
                {
                  color: colors.texto,
                  borderColor: colors.gris,
                  backgroundColor: colors.input,
                },
              ]}
              placeholder="Nuevo título"
              placeholderTextColor={colors.gris}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ marginRight: 16, color: colors.gris }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={renombrarHistorial}>
                <Text style={{ color: colors.primario, fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fecha: {
    fontSize: 12,
    marginTop: 4,
  },
  boton: {
    marginTop: 10,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  botonReset: {
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modalFondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContenido: {
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
})
