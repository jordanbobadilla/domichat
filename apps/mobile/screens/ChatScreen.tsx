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
} from "react-native"
import { getHistorial } from "../services/api"
import config from "../constants/config"

export default function ChatScreen({ route }: any) {
  const { token, nombre } = route.params
  const [mensaje, setMensaje] = useState("")
  const [historial, setHistorial] = useState<
    { mensaje: string; respuesta: string; creadoEn: string }[]
  >([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    async function cargarHistorial() {
      try {
        const data = await getHistorial(token)
        setHistorial(data.historial)
      } catch (err: any) {
        console.error("Historial error:", err.message)
      }
    }

    cargarHistorial()
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>Hola, {nombre} 👋</Text>

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
})
