import Link from 'next/link'
import React from 'react'
import { getAuthSession } from '@/lib/auth'
import UserMenu from '@/components/user-menu'
import NavLink from '@/components/nav-link'

const AdminNavbar = async () => {
  const session = await getAuthSession()

  return (
    <div className="flex items-center px-12 pt-4 border-b">
      <nav className="flex justify-between items-center gap-4">
        <NavLink href={{ pathname: '/tournaments' }}>Tournaments</NavLink>
        <NavLink href={{ pathname: '/competitors' }}>Competitors</NavLink>
      </nav>
      <UserMenu user={session?.user} />
    </div>
  )
}

export default AdminNavbar
