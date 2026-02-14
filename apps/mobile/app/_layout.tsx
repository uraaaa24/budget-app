import { env } from "@/lib/env"
import { queryClient } from "@/lib/query-client"
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import "../global.css"

WebBrowser.maybeCompleteAuthSession()

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <SignedIn>
            <Stack.Screen name="(tabs)" />
          </SignedIn>
          <SignedOut>
            <Stack.Screen name="sign-in" />
          </SignedOut>
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
