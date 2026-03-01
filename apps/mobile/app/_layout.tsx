import { queryClient } from "@/lib/query-client"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack, useRouter, useSegments } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import { useEffect } from "react"
import "../global.css"

WebBrowser.maybeCompleteAuthSession()

const RootNavigator = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    const inSignInRoute = segments[0] === "sign-in"

    if (!isSignedIn && !inSignInRoute) {
      router.replace("/sign-in")
      return
    }

    if (isSignedIn && inSignInRoute) {
      router.replace("/(tabs)")
    }
  }, [isLoaded, isSignedIn, router, segments])

  if (!isLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="transaction-modal"
          options={{
            presentation: "transparentModal",
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  )
}

export default RootLayout
