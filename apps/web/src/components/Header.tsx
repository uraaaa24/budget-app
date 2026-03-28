import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  CreditCard,
  Receipt,
} from "lucide-react"
import { useState } from "react"
import ClerkHeader from "../integrations/clerk/header-user.tsx"

export default function Header() {
  const router = useRouterState()
  const currentPath = router.location.pathname
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-4 left-4 right-4 z-20">
      <div className="mx-auto max-w-2xl">
        <div className="border border-border bg-white/95 backdrop-blur-md rounded-2xl">
          {/* Top Row - Navigation */}
          <nav className="relative flex items-center justify-between p-4">
            {/* Left - Menu Button */}
            <Popover
              modal={false}
              open={isMenuOpen}
              onOpenChange={setIsMenuOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.25">
                    <span
                      className={cn(
                        "w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-center",
                        isMenuOpen && "rotate-45 translate-y-1.75",
                      )}
                    />
                    <span
                      className={cn(
                        "w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out",
                        isMenuOpen && "opacity-0",
                      )}
                    />
                    <span
                      className={cn(
                        "w-full h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out origin-center",
                        isMenuOpen && "-rotate-45 -translate-y-1.75",
                      )}
                    />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(100vw-2rem)] max-w-2xl p-4 bg-white/95 backdrop-blur-md rounded-2xl border-border shadow-none"
                align="start"
                alignOffset={-17}
                sideOffset={24}
              >
                <nav className="space-y-2">
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
              </PopoverContent>
            </Popover>

            {/* Right - User */}
            <div className="flex items-center gap-2">
              <ClerkHeader />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
