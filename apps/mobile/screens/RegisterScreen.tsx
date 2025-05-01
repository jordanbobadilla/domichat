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
import AsyncStorage from "@react-native-async-storage/async-storage"
import { registrarUsuario } from "../services/api"
import { ROUTES } from "../constants/routes"
import { colors } from "../constants/colors"

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
            params: { token: res.token, nombre: res.usuario.nombre },
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
      style={{ flex: 1, backgroundColor: colors.fondo }}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>Crear cuenta</Text>

        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#888"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.boton}
          onPress={manejarRegistro}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>
            {cargando ? "Registrando..." : "Registrarse"}
          </Text>
        </TouchableOpacity>

        <View style={styles.enlace}>
          <Text style={{ color: colors.texto }}>¿Ya tienes cuenta? </Text>
          <Text
            onPress={() => navigation.replace(ROUTES.LOGIN)}
            style={{ color: colors.primario, fontWeight: "600" }}
          >
            Inicia sesión
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
