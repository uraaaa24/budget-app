import { useAuth, useSSO } from "@clerk/clerk-expo"
import { OAuthStrategy } from "@clerk/types"
import * as AuthSession from "expo-auth-session"
import { Redirect } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import * as React from "react"
import { useCallback, useEffect } from "react"
import { Platform, Text, TouchableOpacity, View } from "react-native"

const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === "web") return

    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}
WebBrowser.maybeCompleteAuthSession()

type OAuthButtonProps = {
  strategy: OAuthStrategy
  label: string
}

const OAuthButton = ({ strategy, label }: OAuthButtonProps) => {
  useWarmUpBrowser()
  const { startSSOFlow } = useSSO()

  /**
   * ユーザーがOAuthサインインボタンを押したときの処理
   */
  const handlePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      if (!createdSessionId) throw new Error("Failed to create session")
      if (!setActive) throw new Error("setActive is not available")

      setActive({ session: createdSessionId })
    } catch (error) {
      console.error(error)
    }
  }, [startSSOFlow, strategy])

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="h-12 w-full items-center justify-center rounded-xl bg-black"
    >
      <Text className="text-base font-semibold text-white">{label}</Text>
    </TouchableOpacity>
  )
}

const SignInPage = () => {
  const { isSignedIn } = useAuth()

  if (isSignedIn) return <Redirect href="/(tabs)" />

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <Text className="text-2xl font-bold text-slate-900">Sign in</Text>
        <Text className="mt-2 text-sm text-slate-500">
          Google アカウントでログインします
        </Text>

        <View className="mt-6">
          <OAuthButton strategy="oauth_google" label="Continue with Google" />
        </View>
      </View>
    </View>
  )
}

export default SignInPage
