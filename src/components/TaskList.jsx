export default function TaskList({ tasks, userMap, onToggle, canToggle }) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-slate-300 shadow-xl">
        No tasks yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const allowToggle = canToggle ? canToggle(task) : true
        const initials = (userMap[task.assigned_to] || 'U')
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
        return (
        <div
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-400/20 text-xs font-bold text-fuchsia-200">
              {initials}
            </span>
            <div>
              <p className="font-medium text-white">{task.title}</p>
              <p className="text-sm text-slate-300">
                {task.projects?.name || 'No project'} • {userMap[task.assigned_to] || 'Unknown user'}
              {task.due_date ? ` • Due ${task.due_date}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!allowToggle}
            onClick={() => onToggle(task)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              task.status === 'done'
                ? 'bg-emerald-400/20 text-emerald-200'
                : 'bg-amber-400/20 text-amber-200'
            } ${!allowToggle ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {task.status === 'done' ? 'Done' : 'Todo'}
          </button>
        </div>
        )
      })}
    </div>
  )
}
