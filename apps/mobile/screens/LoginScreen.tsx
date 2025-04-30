import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import { login } from "../services/api"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const iniciarSesion = async () => {
    try {
      const res = await login(email, password)
      console.log("Token:", res.token)
      navigation.navigate("Chat", {
        token: res.token,
        nombre: res.usuario.nombre,
      })
    } catch (err: any) {
      Alert.alert("Error", err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión en DomiChat</Text>
      <TextInput
        placeholder="Correo"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={iniciarSesion} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
})
