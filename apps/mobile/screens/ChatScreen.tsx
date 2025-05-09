import React, { useEffect, useState, useRef } from "react"
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
import { colors } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Speech from "expo-speech"
import { generarTitulo } from "../utils/generarTitulo"
import axios from "axios"

export default function ChatScreen({ route }: any) {
  const { token, nombre, mensajePrevio, respuestaPrevio } = route.params

  const [mensaje, setMensaje] = useState("")
  const [historial, setHistorial] = useState<
    { mensaje: string; respuesta: string; creadoEn: string }[]
  >(
    mensajePrevio && respuestaPrevio
      ? [
          {
            mensaje: mensajePrevio,
            respuesta: respuestaPrevio,
            creadoEn: new Date().toISOString(),
          },
        ]
      : []
  )
  const [cargando, setCargando] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const [vozDominicana, setVozDominicana] = useState("popi")

  useEffect(() => {
    if (!mensajePrevio && !respuestaPrevio) {
      getHistorial(token)
        .then((data) => setHistorial(data.historial))
        .catch(console.error)
    }
    AsyncStorage.getItem("voz_dominicana").then((voz) => {
      if (voz) setVozDominicana(voz)
    })
  }, [])

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
      const historial = prev ? JSON.parse(prev) : []
      historial.unshift(nuevo)
      await AsyncStorage.setItem("historial", JSON.stringify(historial))
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.fondo }}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {historial.map((item, index) => (
          <View key={index}>
            <View style={styles.mensajeUsuario}>
              <Text style={styles.textoUsuario}>{item.mensaje}</Text>
            </View>
            <View style={styles.mensajeBot}>
              <Text style={styles.textoBot}>{item.respuesta}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={mensaje}
          onChangeText={setMensaje}
          placeholder="Escribe tu mensaje..."
          style={styles.input}
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
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  mensajeBot: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  textoUsuario: {
    fontSize: 16,
    color: "#000",
  },
  textoBot: {
    fontSize: 16,
    color: "#000",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
    marginRight: 8,
  },
})
