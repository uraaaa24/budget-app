import { DashboardPage } from "@/features/dashboard/pages/dashboard-page"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  return (
    <>
      <SignedIn>
        <DashboardPage />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
