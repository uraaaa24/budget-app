import { SignInForm } from "@/features/auth/components/sign-in-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/sign-in")({ component: SignInPage })

function SignInPage() {
  return <SignInForm />
}
