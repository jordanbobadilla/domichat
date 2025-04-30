import React, { useState } from "react"
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

export default function ChatScreen({ route }: any) {
  const { token, nombre } = route.params
  const [mensaje, setMensaje] = useState("")
  const [respuestas, setRespuestas] = useState<string[]>([])
  const [cargando, setCargando] = useState(false)

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return

    try {
      setCargando(true)

      const res = await fetch("http://10.0.0.8:4000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error en la IA")
      }

      setRespuestas([
        ...respuestas,
        `🧑 Tú: ${mensaje}`,
        `🤖 DomiChat: ${data.respuesta}`,
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
          {respuestas.map((linea, i) => (
            <Text key={i} style={{ marginBottom: 10 }}>
              {linea}
            </Text>
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
})
