import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })
      setMessage(error ? error.message : 'Signup successful. Please log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    }

    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur"
      >
        <h1 className="text-2xl font-semibold text-white">{isSignup ? 'Create account' : 'Welcome back'}</h1>
        <p className="mb-4 mt-1 text-sm text-slate-300">Manage projects and team tasks</p>
        {isSignup && (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="mb-2 w-full rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-400"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="mb-2 w-full rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-400"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-400"
        />
        {message && <p className="mt-2 text-sm text-rose-300">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignup((value) => !value)}
          className="mt-3 w-full text-sm text-cyan-200 underline"
        >
          {isSignup ? 'Already have an account? Login' : 'No account? Sign up'}
        </button>
      </form>
    </main>
  )
}
