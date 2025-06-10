import React, { useEffect, useState, useRef, useContext } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { BASE_URL, getHistorial } from "../services/api"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Speech from "expo-speech"
import { generarTitulo } from "../utils/generarTitulo"
import axios from "axios"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import Header from "../components/Header"
import Markdown from "react-native-markdown-display"

export default function ChatScreen({ route }: any) {
  const params = route?.params || {}
  const {
    token = null,
    nombre = "",
    mensajePrevio = "",
    respuestaPrevio = "",
  } = params

  const historialInicial =
    mensajePrevio && respuestaPrevio
      ? [
          {
            mensaje: mensajePrevio,
            respuesta: respuestaPrevio,
            creadoEn: new Date().toISOString(),
          },
        ]
      : []

  const [mensaje, setMensaje] = useState("")
  const [historial, setHistorial] = useState(historialInicial)
  const [cargando, setCargando] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const [vozDominicana, setVozDominicana] = useState("popi")

  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    if (!mensajePrevio && !respuestaPrevio && token) {
      getHistorial(token)
        .then((data) => setHistorial(data.historial || []))
        .catch(console.error)
    }

    AsyncStorage.getItem("voz_dominicana").then((voz) => {
      if (voz) setVozDominicana(voz)
    })
  }, [historial])

  const reproducirVoz = (texto: string) => {
    let opciones: Speech.SpeechOptions = {
      language: "es-DO",
      rate: 0.9,
    }
    Speech.speak(texto, opciones)
  }

  const guardarNuevoHistorial = async (mensajes: any[]) => {
    const nuevo = {
      id: Date.now().toString(),
      titulo: generarTitulo(
        mensajes.map((m) => ({ rol: "usuario", texto: m.mensaje }))
      ),
      fecha: new Date().toISOString(),
      mensajes,
    }

    try {
      const prev = await AsyncStorage.getItem("historial")
      const historialLocal = prev ? JSON.parse(prev) : []
      historialLocal.unshift(nuevo)
      await AsyncStorage.setItem("historial", JSON.stringify(historialLocal))

      if (token) {
        await axios.post(
          `${BASE_URL}/chat/historial`,
          { titulo: nuevo.titulo, fecha: nuevo.fecha, mensajes },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (err) {
      console.error("Error guardando historial", err)
    }
  }

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return

    try {
      setCargando(true)
      const res = await axios.post(
        `${BASE_URL}/chat`,
        { mensaje, historial },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const nuevaRespuesta = res.data.respuesta
      const nuevoHistorial = [
        ...historial,
        {
          mensaje,
          respuesta: nuevaRespuesta,
          creadoEn: new Date().toISOString(),
        },
      ]
      setHistorial(nuevoHistorial)
      setMensaje("")
      reproducirVoz(nuevaRespuesta)

      if (historial.length === 0) {
        guardarNuevoHistorial(nuevoHistorial)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      style={{ flex: 1, backgroundColor: colors.fondo }}
    >
      <Header titulo={`Hola, ${nombre.split(" ")[0]} 👋`} />
      {historial.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitulo, { color: colors.texto }]}>
            ¡Bienvenido a DomiChat!
          </Text>
          <Text style={[styles.emptyTexto, { color: colors.gris }]}>
            Comienza escribiendo tu primera pregunta o mensaje.
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {historial.map((item, index) => (
            <View key={index}>
              <View
                style={[
                  styles.mensajeUsuario,
                  {
                    backgroundColor:
                      index % 2 === 0 ? colors.primario : colors.secundario,
                  },
                ]}
              >
                <Text style={{ color: "#fff" }}>{item.mensaje}</Text>
              </View>
              <View style={styles.mensajeBot}>
                <Markdown style={{ body: { color: "#000" } }}>
                  {item.respuesta}
                </Markdown>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={[styles.inputContainer, { backgroundColor: colors.fondo }]}>
        <TextInput
          value={mensaje}
          onChangeText={setMensaje}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor={colors.gris}
          style={[
            styles.input,
            { backgroundColor: colors.input, color: colors.texto },
          ]}
        />
        <TouchableOpacity onPress={enviarMensaje} disabled={cargando}>
          <Ionicons name="send" size={24} color={colors.primario} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  chatContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  mensajeUsuario: {
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  mensajeBot: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyTexto: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
})
