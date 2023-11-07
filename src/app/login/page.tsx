import LoginForm from '@/app/login/LoginForm'

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm">
            Use your email and password to sign in
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
