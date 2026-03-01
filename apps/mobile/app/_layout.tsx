import { queryClient } from "@/lib/query-client"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import { QueryClientProvider } from "@tanstack/react-query"
import { Redirect, Stack } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import "../global.css"

WebBrowser.maybeCompleteAuthSession()

const RootNavigator = () => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      {isSignedIn && <Redirect href="/(tabs)" />}
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
