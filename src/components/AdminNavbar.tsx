import Link from 'next/link'
import React from 'react'
import { getAuthSession } from '@/lib/auth'
import UserMenu from '@/components/user-menu'

const AdminNavbar = async () => {
  const session = await getAuthSession()

  return (
    <div className="flex items-center px-12 p-4 border-b">
      <nav className="flex justify-between items-center gap-8">
        <Link href={{ pathname: '/' }}>Tournaments</Link>
        <Link href={{ pathname: '/competitors' }}>Competitors</Link>
      </nav>
      <UserMenu user={session?.user} />
    </div>
  )
}

export default AdminNavbar
