import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import * as Speech from "expo-speech"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { ROUTES } from "../constants/routes"

const voces = [
  {
    id: "popi",
    label: "Popi (educado capitaleño)",
    ejemplo: "Hola, soy DomiChat. ¿Cómo puedo ayudarte, mi hermano?",
  },
  {
    id: "wawawa",
    label: "Wawawa (coloquial capitaleño)",
    ejemplo: "¡Ey loco! Dime a ve, ¿en qué te ayudo?",
  },
  {
    id: "cibaeña",
    label: "Cibaeña (Santiago)",
    ejemplo: "Oye manito, ¿qué tú necesitas? Tamo aitivo pa eso.",
  },
  {
    id: "sureña",
    label: "Sureña (Ocoa)",
    ejemplo: "Ajá, ¿en qué e’ que yo puedo ayudarte mi líder?",
  },
]

export default function VozTutorialScreen({ navigation }: any) {
  const seleccionar = async (id: string) => {
    await AsyncStorage.setItem("voz_dominicana", id)
    navigation.replace(ROUTES.LOGIN) // o navegación principal
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Elige cómo quieres que DomiChat te hable 🇩🇴
      </Text>
      {voces.map((voz) => (
        <TouchableOpacity
          key={voz.id}
          onPress={() => Speech.speak(voz.ejemplo)}
          onLongPress={() => seleccionar(voz.id)}
          style={styles.opcion}
        >
          <Text style={styles.texto}>{voz.label}</Text>
          <Text style={styles.ejemplo}>{voz.ejemplo}</Text>
          <Text style={styles.instruccion}>
            🔊 Presiona para escuchar • Mantén presionado para elegir
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0057A5",
    marginBottom: 24,
    textAlign: "center",
  },
  opcion: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  texto: { fontSize: 18, fontWeight: "600", color: "#333" },
  ejemplo: { fontSize: 16, color: "#555", marginTop: 8 },
  instruccion: { fontSize: 12, color: "#999", marginTop: 4 },
})
