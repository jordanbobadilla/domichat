import * as Google from "expo-auth-session/providers/google"
import * as AppleAuthentication from "expo-apple-authentication"
import { Platform } from "react-native"

export function useGoogleLogin() {
  return Google.useAuthRequest({
    iosClientId: "TU_IOS_CLIENT_ID",
    androidClientId: "TU_ANDROID_CLIENT_ID",
  })
}

export async function loginWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })
    return credential
  } catch (error) {
    console.error("Apple login error:", error)
    return null
  }
}
