import { getAuthSession } from '@/lib/auth'
import UserMenu from '@/components/user-menu'
import NavLink from '@/components/nav-link'
import { ModeToggle } from '@/components/theme-toggle'

const AdminNavbar = async () => {
  const session = await getAuthSession()

  return (
    <div className="flex items-center px-12 pt-4 border-b justify-between">
      <nav className="flex justify-between items-center gap-4">
        <NavLink href={{ pathname: '/tournaments' }}>Tournaments</NavLink>
        <NavLink href={{ pathname: '/competitors' }}>Competitors</NavLink>
      </nav>
      <div className="flex items-center gap-3">
      <ModeToggle />
      <UserMenu user={session?.user} />
      </div>
    </div>
  )
}

export default AdminNavbar
