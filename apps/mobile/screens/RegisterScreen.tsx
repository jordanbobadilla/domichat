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
import AsyncStorage from "@react-native-async-storage/async-storage"
import { registrarUsuario } from "../services/api"
import { ROUTES } from "../constants/routes"

export default function RegisterScreen({ navigation }: any) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarRegistro = async () => {
    if (!nombre || !email || !password) {
      return Alert.alert("Por favor completa todos los campos")
    }

    try {
      setCargando(true)
      const res = await registrarUsuario(nombre, email, password)

      await AsyncStorage.setItem("token", res.token)
      await AsyncStorage.setItem("nombre", res.usuario.nombre)

      navigation.reset({
        index: 0,
        routes: [
          {
            name: ROUTES.MAIN_TABS,
            params: {
              token: res.token,
              nombre: res.usuario.nombre,
            },
          },
        ],
      })
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
        <Text style={styles.titulo}>Crear cuenta</Text>

        <TextInput
          placeholder="Nombre completo"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={cargando ? "Creando cuenta..." : "Registrarse"}
          onPress={manejarRegistro}
        />

        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center" }}>
            ¿Ya tienes cuenta?{" "}
            <Text
              style={{ color: "blue" }}
              onPress={() => navigation.replace(ROUTES.LOGIN)}
            >
              Inicia sesión
            </Text>
          </Text>
        </View>
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
