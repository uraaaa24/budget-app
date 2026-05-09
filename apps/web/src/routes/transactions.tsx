import { TransactionsPage } from "@/features/transactions/pages/transactions-page"
import { useAuth } from "@clerk/clerk-react"
import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/transactions")({ component: Transactions })

function Transactions() {
  const { isLoaded, isSignedIn } = useAuth()

  // Show nothing while loading to prevent flash
  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />
  }

  return <TransactionsPage />
}
