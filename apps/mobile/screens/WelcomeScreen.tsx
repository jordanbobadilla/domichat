import React, { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { ROUTES } from "../constants/routes"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

export default function WelcomeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true)
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const verificar = async () => {
      const yaVisto = await AsyncStorage.getItem("welcome_shown")
      if (yaVisto === "true") {
        navigation.replace("Login")
      } else {
        setLoading(false)
      }
    }
    verificar()
  }, [])

  const continuar = async () => {
    await AsyncStorage.setItem("welcome_shown", "true")
    navigation.replace(ROUTES.VOZ_TUTORIAL)
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.fondo }]}>
        <ActivityIndicator size="large" color={colors.primario} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.fondo }]}>
      <Image
        source={require("../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.titulo, { color: colors.texto }]}>
        Bienvenido a DomiChat
      </Text>
      <Text style={[styles.subtitulo, { color: colors.gris }]}>
        Tu asistente dominicano inteligente 🇩🇴
      </Text>

      <TouchableOpacity
        onPress={continuar}
        style={[styles.boton, { backgroundColor: colors.primario }]}
      >
        <Text style={styles.botonTexto}>Empezar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
