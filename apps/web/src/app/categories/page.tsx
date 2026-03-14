import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CategoryManagement } from "@/features/categories/components/category-management"

export default async function CategoriesPage() {
  const { userId } = await auth()

  if (!userId) redirect("/sign-in")

  return <CategoryManagement />
}
