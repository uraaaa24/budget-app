import { DashboardScreen } from "@/features/dashboard"
import { useAuth } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"

const HomeScreen = () => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null

  if (!isSignedIn) return <Redirect href="/sign-in" />

  return <DashboardScreen />
}

export default HomeScreen
