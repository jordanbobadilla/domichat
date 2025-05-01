import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getEstadoSuscripcion } from "../services/api"

export default function PerfilScreen({ route, navigation }: any) {
  const { nombre } = route.params
  const [suscripcion, setSuscripcion] = useState<null | {
    activa: boolean
    expiracion?: string
  }>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarEstado = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) throw new Error("No hay token")
        const estado = await getEstadoSuscripcion(token)
        setSuscripcion(estado)
      } catch (err) {
        console.error("Error al cargar suscripción:", err)
        setSuscripcion(null)
      } finally {
        setCargando(false)
      }
    }

    cargarEstado()
  }, [])

  const cerrarSesion = async () => {
    await AsyncStorage.clear()
    navigation.replace("Login")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>👤 {nombre}</Text>

      {cargando ? (
        <ActivityIndicator
          size="large"
          color="#333"
          style={{ marginTop: 30 }}
        />
      ) : suscripcion?.activa ? (
        <Text style={styles.estado}>
          ✅ Suscripción activa hasta:{" "}
          {new Date(suscripcion.expiracion!).toLocaleDateString()}
        </Text>
      ) : (
        <Text style={styles.estado}>🚫 No tienes suscripción activa</Text>
      )}

      <View style={{ marginTop: 40 }}>
        <Button title="Cerrar sesión" onPress={cerrarSesion} color="red" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  estado: { fontSize: 16, marginTop: 10, color: "#555" },
})
