import Link from 'next/link'
import React from 'react'

const AdminNavbar = () => (
  <div className="flex items-center p-4 border-b">
    <Link href={{ pathname: '/' }}>Home</Link>
    <nav className="flex justify-between items-center ml-16 gap-8">
      <Link href={{ pathname: '/dashboard' }}>Tournaments</Link>
      <Link href={{ pathname: '/dashboard/competitors' }}>Competitors</Link>
    </nav>
    <div className="ml-auto flex items-center">UserPic</div>
  </div>
)

export default AdminNavbar
