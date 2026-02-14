import { useSSO } from "@clerk/clerk-expo"
import * as Linking from "expo-linking"
import * as WebBrowser from "expo-web-browser"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"

export function SignInForm() {
  const { startSSOFlow } = useSSO()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signInWithGoogle = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const redirectUrl = Linking.createURL("/sign-in")
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      })

      if (!createdSessionId) {
        setError("Sign in was not completed. Please try again.")
        return
      }

      await setActive?.({ session: createdSessionId })
    } catch {
      setError("Failed to sign in. Check your Clerk OAuth settings.")
    } finally {
      setIsSubmitting(false)
      try {
        WebBrowser.dismissBrowser()
      } catch {
        // no-op: dismiss may be unsupported depending on platform/runtime
      }
    }
  }

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="mb-4 text-lg font-semibold text-slate-900">Sign In</Text>
      <Text className="mb-3 text-sm text-slate-600">
        Continue with Google using Clerk hosted auth.
      </Text>

      {error ? <Text className="mb-3 text-rose-600">{error}</Text> : null}

      <Pressable
        onPress={signInWithGoogle}
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-3"
      >
        <Text className="text-center font-semibold text-white">
          {isSubmitting ? "Redirecting..." : "Continue with Google"}
        </Text>
      </Pressable>
    </View>
  )
}
