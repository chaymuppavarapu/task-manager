import { useState } from 'react'

export default function TaskForm({ projects, users, onCreate }) {
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim() || !projectId || !assignedTo) return
    setLoading(true)
    setError('')
    const result = await onCreate({
      title: title.trim(),
      status: 'todo',
      project_id: projectId,
      assigned_to: assignedTo,
      due_date: dueDate || null,
    })
    if (result?.ok) {
      setTitle('')
      setProjectId('')
      setAssignedTo('')
      setDueDate('')
    } else {
      setError(result?.error || 'Could not create task')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur">
      <h2 className="mb-3 text-base font-semibold text-white">Create Task</h2>
      <div className="grid gap-2 md:grid-cols-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          className="rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-400"
        />
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
          value={assignedTo}
          onChange={(event) => setAssignedTo(event.target.value)}
          className="rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white"
        >
          <option value="">Assign user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || 'Unnamed user'}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="rounded-lg border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Create'}
      </button>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </form>
  )
}
