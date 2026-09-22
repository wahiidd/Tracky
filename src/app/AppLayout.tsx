import { AnimatePresence, motion } from 'framer-motion'
import { Award, CalendarDays, LayoutGrid, User } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Aujourd’hui', icon: LayoutGrid, end: true },
  { to: '/profil', label: 'Profil', icon: User },
  { to: '/badges', label: 'Badges', icon: Award },
  { to: '/stats', label: 'Historique', icon: CalendarDays },
]

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <main className="flex-1 px-4 pb-24 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 mx-auto flex max-w-2xl justify-around border-t border-border bg-surface px-2 pt-2"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
