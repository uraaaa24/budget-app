import { useAuth } from "@clerk/clerk-react"
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" />

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="mx-auto max-w-2xl px-8 pt-24 pb-24 space-y-8">
        <Outlet />
      </div>
    </div>
  )
}
