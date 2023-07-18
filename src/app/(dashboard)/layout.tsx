import AdminNavbar from '@/components/AdminNavbar'
import React, { ReactNode } from 'react'

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <>
    <AdminNavbar />
    <main className="bg-white flex-col flex-grow pt-4 px-6 md:pt-6 md:px-16">
      {children}
    </main>
  </>
)

export default DashboardLayout
