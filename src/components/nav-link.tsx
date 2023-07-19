'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

const NavLink = ({ href, children }: any) => {
  const pathName = usePathname()
  const isActive = pathName === href.pathname
  const classes = twMerge(
    'text-gray-500 hover:underline px-2 py-2',
    `${isActive && `text-black border-b-blue-600 border-b`}`
  )
  return (
    <Link href={href} className={classes} passHref>
      {children}
    </Link>
  )
}

export default NavLink
