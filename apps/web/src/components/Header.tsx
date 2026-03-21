import { Link } from "@tanstack/react-router"
import ClerkHeader from "../integrations/clerk/header-user.tsx"
import ThemeToggle from "./ThemeToggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md px-4">
      <nav className="mx-auto max-w-2xl flex items-center justify-between py-3">
        <h1 className="m-0 text-base font-semibold text-foreground">
          <Link
            to="/"
            className="no-underline transition-colors hover:text-muted-foreground"
          >
            家計簿
          </Link>
        </h1>

        <div className="flex items-center gap-2">
          <ClerkHeader />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
