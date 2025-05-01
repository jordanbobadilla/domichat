import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { confirmarSuscripcion, getEstadoSuscripcion } from "../services/api"
import { Alert } from "react-native"
import { ROUTES } from "../constants/routes"

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
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.LOGIN }],
    })
  }

  const activarSuscripcion = async () => {
    Alert.alert(
      "Confirmar activación",
      "¿Deseas activar tu suscripción premium por 1 mes?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Activar",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token")
              if (!token) throw new Error("Sesión no encontrada")

              await confirmarSuscripcion(token)

              const estado = await getEstadoSuscripcion(token)
              setSuscripcion(estado)
            } catch (err: any) {
              console.error("Error al activar suscripción:", err.message)
              Alert.alert("Error", err.message)
            }
          },
        },
      ]
    )
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

      {!suscripcion?.activa && (
        <View style={{ marginTop: 20 }}>
          <Button title="Activar suscripción" onPress={activarSuscripcion} />
        </View>
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
