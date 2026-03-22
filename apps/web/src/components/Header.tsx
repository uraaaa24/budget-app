import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import { useState } from "react"
import ClerkHeader from "../integrations/clerk/header-user.tsx"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-10 border border-border bg-white/95 backdrop-blur-md rounded-2xl">
        <nav className="mx-auto max-w-2xl relative flex items-center justify-between py-3 px-4">
          {/* Left - Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Center - Logo */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center transition-opacity hover:opacity-70 active:opacity-50"
          >
            <img
              src="/app-icon.png"
              alt="Yutori"
              className="h-8 w-8 rounded-lg"
            />
          </Link>

          {/* Right - User */}
          <div className="flex items-center gap-2">
            <ClerkHeader />
            {/* <ThemeToggle /> */}
          </div>
        </nav>
      </header>

      {/* Navigation Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg font-medium">メニュー</SheetTitle>
          </SheetHeader>
          <nav className="space-y-1 mt-4">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              取引履歴
            </Link>
            {/* 追加のメニューアイテムをここに */}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
