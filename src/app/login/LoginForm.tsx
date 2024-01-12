'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        const resp = await signIn('credentials', {
          redirect: false,
          email: e.currentTarget.email.value,
          password: e.currentTarget.password.value,
          // @ts-ignore
        })
        if (resp?.error) {
          setLoading(false)
          toast.error(resp.error)
        } else {
          router.push('/')
        }
      }}
      className="flex flex-col space-y-4 px-4 py-8 sm:px-16"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="panic@thedis.co"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border
          px-3 py-2 shadow-sm focus:border-black
          focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md border px-3 py-2
           shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <Button disabled={loading}>
        {loading ? 'Logging in' : 'Sign In'}
      </Button>
      {/*<p className="text-center text-sm">*/}
      {/*  Don&apos;t have an account?{' '}*/}
      {/*  <Link href="/register" className="font-semibold">*/}
      {/*    Sign up*/}
      {/*  </Link>{' '}*/}
      {/*  for free.*/}
      {/*</p>*/}
    </form>
  )
}
