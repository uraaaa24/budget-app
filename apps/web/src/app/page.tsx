import { DashboardClient } from "@/features/dashboard/components/dashboard-client"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) redirect("/sign-in")

  return <DashboardClient />
}
