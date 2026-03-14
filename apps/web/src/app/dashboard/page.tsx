import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/features/analytics/components/analytics-dashboard"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) redirect("/sign-in")

  return <AnalyticsDashboard />
}
