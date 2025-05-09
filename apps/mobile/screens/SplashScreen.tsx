import React, { useEffect } from "react"
import { View, Text, Image, StyleSheet, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ThemeContext } from "../context/ThemeContext"
import { temas } from "../constants/colors"

export default function SplashScreen({ navigation }: any) {
  const { tema } = React.useContext(ThemeContext)
  const colors = temas[tema]

  const fadeAnim = new Animated.Value(0)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.replace("Welcome")
      }, 800)
    })
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: colors.fondo }]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.nombre, { color: colors.texto }]}>DomiChat</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  nombre: {
    fontSize: 28,
    fontWeight: "bold",
  },
})
