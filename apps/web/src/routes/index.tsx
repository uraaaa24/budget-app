import { TransactionsPage } from "@/features/transactions/pages/transactions-page"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: Transactions })

function Transactions() {
  return (
    <>
      <SignedIn>
        <TransactionsPage />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
