import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getEstadoSuscripcion, confirmarSuscripcion } from "../services/api"
import { colors } from "../constants/colors"
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
        if (!token) throw new Error("No hay sesión")
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

  const activarSuscripcion = () => {
    Alert.alert(
      "Activar suscripción",
      "¿Deseas activar tu suscripción premium por 1 mes?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Activar",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token")
            if (!token) return

            await confirmarSuscripcion(token)
            const nuevoEstado = await getEstadoSuscripcion(token)
            setSuscripcion(nuevoEstado)
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
          color={colors.primario}
          style={{ marginTop: 30 }}
        />
      ) : (
        <>
          {suscripcion?.activa ? (
            <Text style={styles.suscripcionActiva}>
              ✅ Suscripción activa hasta{" "}
              {new Date(suscripcion.expiracion!).toLocaleDateString()}
            </Text>
          ) : (
            <Text style={styles.suscripcionInactiva}>
              🚫 No tienes suscripción activa
            </Text>
          )}

          {!suscripcion?.activa && (
            <TouchableOpacity
              style={styles.botonPrimario}
              onPress={activarSuscripcion}
            >
              <Text style={styles.textoBoton}>Activar suscripción</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <TouchableOpacity style={styles.botonSecundario} onPress={cerrarSesion}>
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.fondo,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primario,
    textAlign: "center",
    marginBottom: 30,
  },
  suscripcionActiva: {
    color: colors.exito,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  suscripcionInactiva: {
    color: colors.texto,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  botonPrimario: {
    backgroundColor: colors.primario,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  botonSecundario: {
    backgroundColor: colors.secundario,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
})
