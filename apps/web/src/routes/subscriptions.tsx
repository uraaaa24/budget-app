import { SubscriptionsPage } from "@/features/subscriptions/pages/subscriptions-page"
import { useAuth } from "@clerk/clerk-react"
import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/subscriptions")({
  component: Subscriptions,
})

function Subscriptions() {
  const { isLoaded, isSignedIn } = useAuth()

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />
  }

  return <SubscriptionsPage />
}
