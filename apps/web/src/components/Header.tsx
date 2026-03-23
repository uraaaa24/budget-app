import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Link, useRouterState } from "@tanstack/react-router"
import { CreditCard, Menu, Receipt, X } from "lucide-react"
import { useState } from "react"
import ClerkHeader from "../integrations/clerk/header-user.tsx"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-10 border border-border bg-white/95 backdrop-blur-md rounded-2xl">
        <nav className="mx-auto max-w-2xl relative flex items-center justify-between p-4">
          {/* Left - Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Center - Page Icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground">
              {currentPath === "/subscriptions" ? (
                <CreditCard className="h-6 w-6" />
              ) : (
                <Receipt className="h-6 w-6" />
              )}
            </div>
          </div>

          {/* Right - User */}
          <div className="flex items-center gap-2">
            <ClerkHeader />
            {/* <ThemeToggle /> */}
          </div>
        </nav>
      </header>

      {/* Navigation Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-80 p-6" showCloseButton={false}>
          <SheetHeader className="pb-8 border-b border-border p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/app-icon.png"
                  alt="Yutori"
                  className="h-10 w-10 rounded-xl"
                />
                <SheetTitle className="text-lg font-medium">Yutori</SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>
          <nav className="space-y-3 mt-8">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                currentPath === "/"
                  ? "bg-accent text-foreground"
                  : "hover:bg-accent/50",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-lg transition-colors",
                  currentPath === "/"
                    ? "bg-accent/50 text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Receipt className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  currentPath === "/"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                取引履歴
              </span>
            </Link>
            <Link
              to="/subscriptions"
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                currentPath === "/subscriptions"
                  ? "bg-accent text-foreground"
                  : "hover:bg-accent/50",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-lg transition-colors",
                  currentPath === "/subscriptions"
                    ? "bg-accent/50 text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  currentPath === "/subscriptions"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                サブスクリプション
              </span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
