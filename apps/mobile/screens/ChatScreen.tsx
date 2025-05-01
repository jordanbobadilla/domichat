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

  useEffect(() => {
    if (!mensajePrevio && !respuestaPrevio) {
      getHistorial(token)
        .then((data) => setHistorial(data.historial))
        .catch(console.error)
    }
  }, [])

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return

    try {
      setCargando(true)

      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensaje }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error en el servidor")
      }

      const data = await res.json()

      setHistorial([
        ...historial,
        {
          mensaje,
          respuesta: data.respuesta,
          creadoEn: new Date().toISOString(),
        },
      ])

      setMensaje("")
      scrollRef.current?.scrollToEnd({ animated: true })
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
      <View style={styles.container}>
        <Text style={styles.titulo}>Hola, {nombre.split(" ")[0]} 👋</Text>

        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {historial.map((item, i) => {
            const esPar = i % 2 === 0

            return (
              <View key={i} style={{ marginBottom: 12 }}>
                {/* Mensaje del usuario */}
                <View
                  style={[
                    styles.mensajeUsuario,
                    {
                      backgroundColor: esPar
                        ? colors.primario
                        : colors.secundario,
                      alignSelf: "flex-end",
                    },
                  ]}
                >
                  <Text style={styles.textoUsuario}>{item.mensaje}</Text>
                </View>

                {/* Respuesta de DomiChat */}
                <View
                  style={[
                    styles.mensajeBot,
                    {
                      backgroundColor: "#fff",
                      alignSelf: "flex-start",
                    },
                  ]}
                >
                  <Text style={styles.textoBot}>{item.respuesta}</Text>
                </View>
              </View>
            )
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#888"
            value={mensaje}
            onChangeText={setMensaje}
          />
          <TouchableOpacity
            style={styles.boton}
            onPress={enviarMensaje}
            disabled={cargando}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primario,
    marginBottom: 10,
  },
  chat: { flex: 1, marginBottom: 10 },
  mensajeCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: colors.borde,
    borderWidth: 1,
  },
  usuario: {
    fontWeight: "600",
    color: colors.primario,
    marginTop: 5,
  },
  texto: {
    fontSize: 15,
    color: colors.texto,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: colors.borde,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  input: {
    flex: 1,
    borderColor: colors.borde,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: colors.texto,
    marginRight: 8,
  },
  boton: {
    backgroundColor: colors.primario,
    padding: 12,
    borderRadius: 10,
  },
  mensajeUsuario: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    borderTopRightRadius: 0,
  },
  mensajeBot: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  textoUsuario: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  textoBot: {
    color: colors.texto,
    fontSize: 15,
  },
})
