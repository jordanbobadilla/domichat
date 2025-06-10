import React, { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { temas } from "../constants/colors"
import { ThemeContext } from "../context/ThemeContext"

const VOCES = [
  { id: "popi", nombre: "Voz Popi (Distrito Nacional)" },
  { id: "wawawa", nombre: "Voz Wawawa (Santo Domingo Este/Oeste)" },
  { id: "cibaeña", nombre: "Voz Cibaeña (Santiago)" },
  { id: "sureña", nombre: "Voz Sureña (San José de Ocoa)" },
]

export default function ConfiguracionScreen() {
  const { tema, toggleTema } = useContext(ThemeContext)
  const colors = temas[tema]
  const [vozSeleccionada, setVozSeleccionada] = useState("")
  const [temaOscuro, setTemaOscuro] = useState(tema === "oscuro")

  useEffect(() => {
    AsyncStorage.getItem("voz_dominicana").then((v) => {
      if (v) setVozSeleccionada(v)
    })
  }, [])

  const seleccionarVoz = async (vozId: string) => {
    await AsyncStorage.setItem("voz_dominicana", vozId)
    setVozSeleccionada(vozId)
  }

  const restaurarValores = async () => {
    await AsyncStorage.setItem("voz_dominicana", "popi")
    setVozSeleccionada("popi")
    Alert.alert("Restaurado", "Se restauró la voz a la opción por defecto.")
  }

  const cambiarTema = async () => {
    await toggleTema()
    setTemaOscuro((prev) => !prev)
    Alert.alert(
      "Tema actualizado",
      `Ahora estás usando el tema ${temaOscuro ? "claro" : "oscuro"}`
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.fondo }]}>
      <Text style={[styles.titulo, { color: colors.texto }]}>
        Selecciona tu voz dominicana favorita
      </Text>

      <FlatList
        data={VOCES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.opcion,
              {
                backgroundColor:
                  vozSeleccionada === item.id ? colors.primario : colors.input,
              },
            ]}
            onPress={() => seleccionarVoz(item.id)}
          >
            <Text
              style={[
                styles.textoOpcion,
                { color: vozSeleccionada === item.id ? "#fff" : colors.texto },
              ]}
            >
              {item.nombre}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.botonReset, { backgroundColor: colors.gris }]}
        onPress={restaurarValores}
      >
        <Text style={styles.textoReset}>Restaurar valores por defecto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botonTema,
          { backgroundColor: temaOscuro ? "#ddd" : "#333" },
        ]}
        onPress={cambiarTema}
      >
        <Text
          style={[styles.textoTema, { color: temaOscuro ? "#000" : "#fff" }]}
        >
          Usar tema {temaOscuro ? "claro" : "oscuro"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingVertical: 64,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  opcion: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  textoOpcion: {
    fontSize: 16,
    fontWeight: "500",
  },
  botonReset: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  textoReset: {
    color: "#fff",
    fontWeight: "bold",
  },
  botonTema: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  textoTema: {
    fontWeight: "bold",
  },
})
