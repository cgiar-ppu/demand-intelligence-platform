import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3 no-underline text-white">
          <img
            src="/src/assets/cgiar-logo.svg"
            alt="CGIAR"
            className="h-8 w-8"
          />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Demand Intelligence Platform
            </h1>
            <p className="text-xs text-white/70">CGIAR</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/explorer" className="text-white/80 hover:text-white transition-colors">
            Explorer
          </Link>
          <span className="text-white/40">|</span>
          <span className="text-white/60 text-xs">v0.1.0</span>
        </nav>
      </div>
    </header>
  )
}
