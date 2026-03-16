export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 px-4 py-6 text-slate-500">
      <div className="mx-auto max-w-7xl text-center">
        <p className="m-0 text-sm">
          &copy; {year} Budget App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
