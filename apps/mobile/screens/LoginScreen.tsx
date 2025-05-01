import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { login } from "../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ROUTES } from "../constants/routes"
import { colors } from "../constants/colors"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const iniciarSesion = async () => {
    if (!email || !password) return Alert.alert("Completa ambos campos")

    try {
      setCargando(true)
      const res = await login(email, password)

      await AsyncStorage.setItem("token", res.token)
      await AsyncStorage.setItem("nombre", res.usuario.nombre)

      navigation.reset({
        index: 0,
        routes: [
          {
            name: ROUTES.MAIN_TABS,
            params: { token: res.token, nombre: res.usuario.nombre },
          },
        ],
      })
    } catch (err: any) {
      Alert.alert("Error al iniciar sesión", err.message)
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
        <Text style={styles.titulo}>Iniciar sesión</Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.boton}
          onPress={iniciarSesion}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>
            {cargando ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.enlace}>
          <Text style={{ color: colors.texto }}>¿No tienes cuenta? </Text>
          <Text
            onPress={() => navigation.replace(ROUTES.REGISTER)}
            style={{ color: colors.primario, fontWeight: "600" }}
          >
            Crea una aquí
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primario,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    color: colors.texto,
  },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  enlace: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
})
