import { SubscriptionsPage } from "@/features/subscriptions/pages/subscriptions-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/subscriptions")({
  component: SubscriptionsPage,
})
