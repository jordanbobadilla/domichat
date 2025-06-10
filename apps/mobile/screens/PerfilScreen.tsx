import React, { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getEstadoSuscripcion } from "../services/api"
import { ROUTES } from "../constants/routes"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"
import { useNavigation } from "@react-navigation/native"
import Header from "../components/Header"

export default function PerfilScreen({ route, navigation }: any) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [foto, setFoto] = useState("")
  const [suscripcion, setSuscripcion] = useState<null | {
    activa: boolean
    expiracion?: string
  }>(null)
  const [cargando, setCargando] = useState(true)
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const nombreGuardado = await AsyncStorage.getItem("nombre")
        const emailGuardado = await AsyncStorage.getItem("email")
        const fotoGuardada = await AsyncStorage.getItem("foto")

        if (nombreGuardado) setNombre(nombreGuardado)
        if (emailGuardado) setEmail(emailGuardado)
        if (fotoGuardada) setFoto(fotoGuardada)

        const token = await AsyncStorage.getItem("token")
        if (!token) throw new Error("No hay sesión")

        const estado = await getEstadoSuscripcion(token)
        setSuscripcion(estado)
      } catch (err) {
        console.error("Error al cargar perfil/suscripción:", err)
      } finally {
        setCargando(false)
      }
    }

    cargarPerfil()
  }, [])

  const cerrarSesion = async () => {
    await AsyncStorage.clear()
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.LOGIN }],
    })
  }

  if (cargando) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.fondo }]}>
        <ActivityIndicator size="large" color={colors.primario} />
        <Text style={{ marginTop: 10, color: colors.texto }}>
          Cargando perfil...
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.fondo }}>
      <Header titulo="Perfil" />
      <View style={[styles.container]}>
        <View style={styles.card}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.primario },
              ]}
            >
              <Text style={styles.avatarInicial}>{nombre.charAt(0)}</Text>
            </View>
          )}

          <Text style={[styles.nombre, { color: colors.texto }]}>{nombre}</Text>
          {email ? (
            <Text style={[styles.email, { color: colors.gris }]}>{email}</Text>
          ) : null}

          <View style={styles.suscripcionBox}>
            <Text style={[styles.subTitulo, { color: colors.texto }]}>
              Estado de suscripción
            </Text>
            {suscripcion?.activa ? (
              <Text style={{ color: colors.exito }}>
                Activa hasta {suscripcion.expiracion}
              </Text>
            ) : (
              <Text style={{ color: colors.peligro }}>
                No tienes suscripción activa
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.botonSecundario,
              { backgroundColor: colors.primario },
            ]}
            onPress={() => navigation.navigate("Configuracion")}
          >
            <Text style={styles.botonTexto}>Configuración de DomiChat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonCerrar, { backgroundColor: colors.peligro }]}
            onPress={cerrarSesion}
          >
            <Text style={styles.botonTexto}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 24,
    paddingRight: 24,
  },
  card: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarInicial: {
    fontSize: 36,
    color: "#fff",
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 24,
  },
  suscripcionBox: {
    marginBottom: 24,
    alignItems: "center",
  },
  subTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  botonSecundario: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  botonCerrar: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
})
