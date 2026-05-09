import { TransactionsPage } from "@/features/transactions/pages/transactions-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/transactions")({
  component: TransactionsPage,
})
