import React, { useContext } from "react"
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

export default function Header({ titulo }: { titulo: string }) {
  const { tema } = useContext(ThemeContext)
  const colors = temas[tema]

  return (
    <SafeAreaView style={{ backgroundColor: colors.primario }} edges={["top"]}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.primario, borderBottomColor: colors.primario },
        ]}
      >
        <Text style={[styles.titulo, { color: "#fff" }]}>{titulo}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
})
