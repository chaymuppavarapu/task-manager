const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'projects', label: 'Projects' },
]

export default function Navbar({ activePage, setActivePage, onLogout, role }) {
  return (
    <header className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Team Task Manager</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-cyan-200">{role || 'member'} access</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
        >
          Logout
        </button>
      </div>
      <nav className="mt-5 flex gap-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActivePage(item.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activePage === item.key
                ? 'bg-cyan-400 text-slate-950'
                : 'border border-white/20 bg-white/10 text-slate-100 hover:bg-white/20'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
