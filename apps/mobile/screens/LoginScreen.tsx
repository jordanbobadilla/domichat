import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { login } from "../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const iniciarSesion = async () => {
    if (!email || !password) return Alert.alert("Completa ambos campos")

    try {
      setCargando(true)

      const res = await login(email, password)

      // Guardar token y nombre localmente
      await AsyncStorage.setItem("token", res.token)
      await AsyncStorage.setItem("nombre", res.usuario.nombre)

      // Redirigir al chat (sin poder volver atrás)
      navigation.replace("Chat", {
        token: res.token,
        nombre: res.usuario.nombre,
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
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>Bienvenido a DomiChat 🇩🇴</Text>

        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={cargando ? "Entrando..." : "Iniciar sesión"}
          onPress={iniciarSesion}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
})
