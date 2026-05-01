import { useState } from 'react'

export default function ProjectForm({ onCreate }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    const result = await onCreate(name.trim())
    if (result?.ok) {
      setName('')
    } else {
      setError(result?.error || 'Could not create project')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur">
      <h2 className="mb-3 text-base font-semibold text-white">Create Project</h2>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          className="flex-1 rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Create'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </form>
  )
}
