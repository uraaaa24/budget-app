import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { useAuth } from "@clerk/clerk-react"
import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth()

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />
  }

  return <DashboardPage />
}
