import React, { ReactNode } from 'react'
import AdminNavbar from '@/components/AdminNavbar'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Admin panel',
}

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex bg-white h-full flex-col min-h-screen text-black">
    <Toaster position='top-center' reverseOrder={false} />
    <AdminNavbar />
    <main className="bg-white flex-col flex-grow pt-4 px-6 md:pt-6 md:px-16">{children}</main>
  </div>
)

export default AdminLayout
