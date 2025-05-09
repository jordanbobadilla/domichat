import React, { useState, useContext } from "react"
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
import { ROUTES } from "../constants/routes"
import { registrarUsuario } from "../services/api"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

export default function RegisterScreen({ navigation }: any) {
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const registrar = async () => {
    if (!nombre || !email || !password) {
      return Alert.alert("Completa todos los campos")
    }

    try {
      setCargando(true)
      const res = await registrarUsuario(nombre, email, password)

      await AsyncStorage.setItem("token", res.token)
      await AsyncStorage.setItem("nombre", res.usuario.nombre)
      await AsyncStorage.setItem("email", res.usuario.email)

      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_TABS, params: { token: res.token } }],
      })
    } catch (err: any) {
      Alert.alert("Error al registrarse", err.message)
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
        <Text style={[styles.titulo, { color: colors.texto }]}>
          Crear cuenta
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.secundario, color: colors.texto },
          ]}
          placeholder="Nombre completo"
          placeholderTextColor={colors.gris}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.secundario, color: colors.texto },
          ]}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.gris}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.secundario, color: colors.texto },
          ]}
          placeholder="Contraseña"
          placeholderTextColor={colors.gris}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.boton, { backgroundColor: colors.primario }]}
          onPress={registrar}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
          <Text style={[styles.link, { color: colors.primario }]}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
  },
  boton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    fontWeight: "600",
  },
})
