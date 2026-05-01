import { useState } from 'react'

export default function ProjectMemberForm({ projects, users, onAddMember, onPromote }) {
  const [projectId, setProjectId] = useState('')
  const [userId, setUserId] = useState('')
  const [promoteUserId, setPromoteUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!projectId || !userId) return
    setLoading(true)
    setError('')
    const result = await onAddMember(projectId, userId)
    if (!result?.ok) setError(result?.error || 'Could not add member')
    setLoading(false)
  }

  const handlePromote = async (event) => {
    event.preventDefault()
    if (!promoteUserId) return
    setLoading(true)
    setError('')
    const result = await onPromote(promoteUserId)
    if (!result?.ok) {
      setError(result?.error || 'Could not update role')
    } else {
      setPromoteUserId('')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur">
      <form onSubmit={handleSubmit}>
      <h2 className="mb-3 text-base font-semibold text-white">Team Management</h2>
      <div className="grid gap-2 md:grid-cols-2">
        <select
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          className="rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white"
        >
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          className="rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white"
        >
          <option value="">Select member</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || 'Unnamed user'}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-lg bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Add to Project'}
      </button>
      </form>
      <form onSubmit={handlePromote}>
        <h3 className="mb-2 text-sm font-semibold text-white">Promote User To Admin</h3>
        <div className="flex gap-2">
          <select
            value={promoteUserId}
            onChange={(event) => setPromoteUserId(event.target.value)}
            className="flex-1 rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white"
          >
            <option value="">Select user</option>
            {users
              .filter((user) => user.role !== 'admin')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || 'Unnamed user'}
                </option>
              ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            Promote
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  )
}
