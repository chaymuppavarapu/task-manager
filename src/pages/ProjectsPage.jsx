import ProjectForm from '../components/ProjectForm'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import ProjectMemberForm from '../components/ProjectMemberForm'

export default function ProjectsPage({
  projects,
  users,
  tasks,
  userMap,
  isAdmin,
  onCreateProject,
  onCreateTask,
  onAddMember,
  onPromote,
  onToggle,
  canToggle,
}) {
  return (
    <section className="space-y-4">
      {isAdmin ? (
        <>
          <ProjectForm onCreate={onCreateProject} />
          <ProjectMemberForm
            projects={projects}
            users={users}
            onAddMember={onAddMember}
            onPromote={onPromote}
          />
          <TaskForm projects={projects} users={users} onCreate={onCreateTask} />
        </>
      ) : (
        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-slate-300 shadow-xl">
          Member access: view and update your assigned tasks.
        </div>
      )}
      <TaskList tasks={tasks} userMap={userMap} onToggle={onToggle} canToggle={canToggle} />
    </section>
  )
}
