import { SubscriptionsPage } from "@/features/subscriptions/pages/subscriptions-page"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/subscriptions")({
  component: Subscriptions,
})

function Subscriptions() {
  return (
    <>
      <SignedIn>
        <SubscriptionsPage />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
