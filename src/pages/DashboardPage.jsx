import StatCard from '../components/StatCard'
import TaskList from '../components/TaskList'

export default function DashboardPage({ tasks, userMap, onToggle, canToggle }) {
  const completed = tasks.filter((task) => task.status === 'done').length
  const overdue = tasks.filter(
    (task) => task.status !== 'done' && task.due_date && task.due_date < new Date().toISOString().slice(0, 10),
  ).length

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Tasks" value={tasks.length} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Pending" value={tasks.length - completed} />
        <StatCard label="Overdue" value={overdue} />
      </div>
      <TaskList tasks={tasks} userMap={userMap} onToggle={onToggle} canToggle={canToggle} />
    </section>
  )
}
