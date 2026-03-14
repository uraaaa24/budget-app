"use client"

import { UserButton } from "@clerk/nextjs"
import { useEffect, useRef, useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto max-w-3xl px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Budget</h1>

          <div ref={menuRef} className="relative">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-label="Menu"
            >
              <span className={`h-0.5 w-6 bg-slate-900 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-6 bg-slate-900 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-6 bg-slate-900 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 border border-slate-200 bg-white shadow-lg">
                <div className="p-4">
                  <UserButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
