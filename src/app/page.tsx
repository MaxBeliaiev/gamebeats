import Link from 'next/link'
import { getServerSession } from 'next-auth'
import SignOutButton from '@/components/SignOutButton'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <Link
          href={{
            pathname: '/stream',
          }}
        >
          Stream
        </Link>
        <Link
          href={{
            pathname: '/',
          }}
        >
          Home
        </Link>
        {session && <SignOutButton />}
        {session ? (
          <Link
            href={{
              pathname: '/dashboard',
            }}
          >
            Admin
          </Link>
        ) : (
          <Link
            href={{
              pathname: '/login',
            }}
          >
            Login
          </Link>
        )}
      </header>
      <h1>Main page</h1>
    </>
  )
}
