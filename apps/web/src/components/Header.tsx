import { Link } from '@tanstack/react-router'
import ClerkHeader from '../integrations/clerk/header-user.tsx'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-4 backdrop-blur-lg">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-4">
        <h1 className="m-0 text-xl font-bold text-slate-900">
          <Link to="/" className="no-underline">
            Budget App
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
