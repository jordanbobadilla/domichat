import React, { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { BASE_URL } from "../services/api"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import Header from "../components/Header"
import { ROUTES } from "../constants/routes"

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
      <View style={{ flex: 1, backgroundColor: colors.fondo }}>
        <Header titulo="Historial" />
        <View style={[styles.centered]}>
          <ActivityIndicator size="large" color={colors.primario} />
          <Text style={{ marginTop: 10, color: colors.texto }}>
            Cargando historial...
          </Text>
        </View>
      </View>
    )
  }

  if (historial.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.fondo }}>
        <Header titulo="Historial" />
        <View style={[styles.centered]}>
          <Text style={{ color: colors.texto }}>
            No tienes conversaciones guardadas aún.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.fondo }}>
      <Header titulo="Historial" />
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.input }]}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={async () => {
                const token = await AsyncStorage.getItem("token")
                navigation.navigate(ROUTES.CHAT, {
                  token,
                  mensajePrevio: item.mensajes[0]?.mensaje,
                  respuestaPrevio: item.mensajes[0]?.respuesta,
                })
              }}
            >
              <Text
                style={[styles.titulo, { color: colors.texto }]}
                numberOfLines={1}
              >
                {item.titulo}
              </Text>
              <Text style={[styles.fecha, { color: colors.gris }]}>
                {new Date(item.fecha).toLocaleDateString()}{" "}
                {new Date(item.fecha).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setChatIdEditando(item.id)
                  setTituloEditando(item.titulo)
                  setModalVisible(true)
                }}
              >
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={colors.primario}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => eliminarHistorial(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.peligro}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={[styles.botonReset, { backgroundColor: colors.gris }]}
            onPress={eliminarTodoElHistorial}
          >
            <Text style={styles.textoBoton}>Eliminar todo el historial</Text>
          </TouchableOpacity>
        }
      />

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
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fecha: {
    fontSize: 12,
    marginTop: 4,
  },
  iconRow: {
    flexDirection: "row",
    marginLeft: 12,
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  botonReset: {
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
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
