import React, { useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

export default function Header({
  titulo,
  onNewChat,
}: {
  titulo: string
  onNewChat?: () => void
}) {
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
        {onNewChat && (
          <TouchableOpacity onPress={onNewChat} style={styles.action}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  action: {
    paddingHorizontal: 12,
  },
})
