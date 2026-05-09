import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/sso-callback")({
  component: SSOCallback,
})

function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Successful authentication, redirect to home
      navigate({ to: "/" })
    }
  }, [isLoaded, isSignedIn, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"></div>
        <p className="text-sm text-gray-600">サインイン処理中...</p>
      </div>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </div>
  )
}
