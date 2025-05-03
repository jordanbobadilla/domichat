// src/screens/WelcomeScreen.tsx
import React, { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../constants/colors"

export default function WelcomeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verificar = async () => {
      const yaVisto = await AsyncStorage.getItem("welcome_shown")
      if (yaVisto === "true") {
        navigation.replace("Login") // o el stack principal
      } else {
        setLoading(false)
      }
    }
    verificar()
  }, [])

  const continuar = async () => {
    await AsyncStorage.setItem("welcome_shown", "true")
    navigation.replace("Login")
  }

  if (loading) return null

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Bienvenido a DomiChat</Text>
      <Text style={styles.subtitulo}>
        Tu asistente dominicano inteligente 🇩🇴
      </Text>
      <TouchableOpacity onPress={continuar} style={styles.boton}>
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
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: { width: 200, height: 200, marginBottom: 30 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primario,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  boton: {
    backgroundColor: colors.primario,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  botonTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
})
