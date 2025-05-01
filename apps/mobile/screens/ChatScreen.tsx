import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getHistorial } from "../services/api"
import { getEstadoSuscripcion } from "../services/api"

import config from "../constants/config"

export default function ChatScreen({ route, navigation }: any) {
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
  const [suscripcion, setSuscripcion] = useState<{
    activa: boolean
    expiracion?: string
  } | null>(null)
  const [modoReanudar, setModoReanudar] = useState(
    !!(mensajePrevio && respuestaPrevio)
  )

  useEffect(() => {
    async function cargarHistorial() {
      try {
        const data = await getHistorial(token)
        setHistorial(data.historial)
      } catch (err: any) {
        console.error("Historial error:", err.message)
      }
    }

    const cargarSuscripcion = async () => {
      try {
        const data = await getEstadoSuscripcion(token)
        setSuscripcion(data)
      } catch (err: any) {
        console.error("Error suscripción:", err.message)
      }
    }

    cargarHistorial()
    cargarSuscripcion()
  }, [])

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return

    try {
      setCargando(true)

      const res = await fetch(`${config.BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en la IA")

      setHistorial([
        {
          mensaje,
          respuesta: data.respuesta,
          creadoEn: new Date().toISOString(),
        },
        ...historial,
      ])
      setMensaje("")
    } catch (err: any) {
      Alert.alert("Error", err.message)
    } finally {
      setCargando(false)
    }
  }

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("nombre")
    setHistorial([])
    navigation.replace("Login")
  }

  const reiniciarConversacion = () => {
    setHistorial([])
    setModoReanudar(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Hola, {nombre.split(" ")[0]} 👋</Text>
          <TouchableOpacity onPress={cerrarSesion}>
            <Text style={styles.cerrar}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {suscripcion && (
          <Text style={{ color: suscripcion.activa ? "green" : "gray" }}>
            {suscripcion.activa
              ? `✅ Suscripción activa hasta: ${new Date(
                  suscripcion.expiracion!
                ).toLocaleDateString()}`
              : "🚫 No tienes una suscripción activa"}
          </Text>
        )}

        {modoReanudar && (
          <Button
            title="🗑️ Reiniciar conversación"
            onPress={reiniciarConversacion}
            color="gray"
          />
        )}

        <ScrollView style={styles.chat}>
          {historial.map((c, i) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <Text style={styles.mensaje}>🧑 Tú: {c.mensaje}</Text>
              <Text style={styles.respuesta}>🤖 DomiChat: {c.respuesta}</Text>
            </View>
          ))}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChangeText={setMensaje}
        />
        <Button
          title={cargando ? "Enviando..." : "Enviar"}
          onPress={enviarMensaje}
          disabled={cargando}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  chat: { flex: 1, marginBottom: 20 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  mensaje: { fontWeight: "600" },
  respuesta: { color: "#444", marginTop: 2 },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  cerrar: {
    color: "red",
    fontWeight: "600",
  },
})
