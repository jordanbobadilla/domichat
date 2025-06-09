import React, { useState, useEffect, useContext } from "react"
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
import { login } from "../services/api"
import { ROUTES } from "../constants/routes"
import { useGoogleLogin, loginWithApple } from "../services/authSocial"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

export default function LoginScreen({ navigation }: any) {
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const [request, response, promptAsync] = useGoogleLogin()

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      Alert.alert("Login con Google exitoso", JSON.stringify(authentication))
    }
  }, [response])

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
        <Text style={[styles.titulo, { color: colors.texto }]}>
          Iniciar sesión
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.input, color: colors.texto },
          ]}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.gris}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.input, color: colors.texto },
          ]}
          placeholder="Contraseña"
          placeholderTextColor={colors.gris}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.boton, { backgroundColor: colors.primario }]}
          onPress={iniciarSesion}
          disabled={cargando}
        >
          <Text style={styles.botonTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonSecundario, { backgroundColor: "#DB4437" }]}
          onPress={() => promptAsync()}
        >
          <Text style={styles.botonTexto}>Entrar con Google</Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={[styles.botonSecundario, { backgroundColor: "#000" }]}
            onPress={loginWithApple}
          >
            <Text style={styles.botonTexto}>Entrar con Apple</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
          <Text style={[styles.link, { color: colors.primario }]}>
            ¿No tienes una cuenta? Regístrate
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
    marginBottom: 12,
  },
  botonSecundario: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
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
