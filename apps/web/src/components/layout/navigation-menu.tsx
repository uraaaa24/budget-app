"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function NavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <div ref={menuRef} className="fixed left-6 top-6 z-50">
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-lg bg-white shadow-lg transition-opacity hover:opacity-75"
        aria-label="Menu"
      >
        <span
          className={`h-0.5 w-6 bg-slate-900 transition-all ${
            isMenuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-900 transition-all ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-900 transition-all ${
            isMenuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="mt-2 w-64 border border-slate-200 bg-white shadow-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`block border-b border-slate-200 py-3 text-sm font-medium transition-opacity hover:opacity-75 ${
                    pathname === "/dashboard"
                      ? "text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={`block border-b border-slate-200 py-3 text-sm font-medium transition-opacity hover:opacity-75 ${
                    pathname === "/" ? "text-slate-900" : "text-slate-600"
                  }`}
                >
                  Transactions
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className={`block border-b border-slate-200 py-3 text-sm font-medium transition-opacity hover:opacity-75 ${
                    pathname === "/categories"
                      ? "text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  Categories
                </Link>
              </li>
            </ul>
          </nav>
          <div className="border-t border-slate-200 p-4">
            <UserButton />
          </div>
        </div>
      )}
    </div>
  )
}
