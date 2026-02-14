import { ScreenContainer } from "@/components/screen-container"
import { SignInForm } from "@/features/auth"
import { useAuth } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"
import { Text, View } from "react-native"

const SignInScreen = () => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <ScreenContainer>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-slate-900">Budget App</Text>
        <Text className="mt-2 text-slate-600">
          Sign in with Clerk to access your data.
        </Text>
      </View>

      <SignInForm />
    </ScreenContainer>
  )
}

export default SignInScreen
