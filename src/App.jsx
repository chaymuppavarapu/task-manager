import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import AuthPage from './pages/AuthPage'
import { hasSupabaseEnv, supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activePage, setActivePage] = useState('dashboard')
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])

  const userMap = useMemo(
    () => users.reduce((acc, user) => ({ ...acc, [user.id]: user.name || 'Unnamed user' }), {}),
    [users],
  )
  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    if (!supabase) return
    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    initSession()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  const ensureProfile = useCallback(async (user) => {
    if (!supabase || !user) return { ok: false, error: 'Not authenticated' }
    const displayName = user.user_metadata?.name || user.email || 'User'
    const { data: existing, error: existingError } = await supabase
      .from('profiles')
      .select('id,role')
      .eq('id', user.id)
      .maybeSingle()
    if (existingError) return { ok: false, error: existingError.message }

    if (existing) {
      const { error } = await supabase.from('profiles').update({ name: displayName }).eq('id', user.id)
      if (error) return { ok: false, error: error.message }
      return { ok: true }
    }

    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
    if (countError) return { ok: false, error: countError.message }
    const role = count === 0 ? 'admin' : 'member'

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: user.id, name: displayName, role })
    if (insertError) return { ok: false, error: insertError.message }
    return { ok: true }
  }, [])

  const refreshData = useCallback(async () => {
    if (!supabase || !session?.user) return
    await ensureProfile(session.user)

    const [{ data: me }, { data: userRows }, { data: allProjects }, { data: memberRows }] =
      await Promise.all([
        supabase.from('profiles').select('id,name,role').eq('id', session.user.id).single(),
        supabase.from('profiles').select('id,name,role').order('name'),
        supabase.from('projects').select('id,name,created_by'),
        supabase.from('project_members').select('project_id').eq('user_id', session.user.id),
      ])

    const memberProjectIds = (memberRows || []).map((item) => item.project_id)
    const visibleProjects = (allProjects || []).filter(
      (project) => me?.role === 'admin' || project.created_by === session.user.id || memberProjectIds.includes(project.id),
    )
    const visibleProjectIds = visibleProjects.map((project) => project.id)
    const assigned = await supabase
      .from('tasks')
      .select('id,title,status,assigned_to,project_id,due_date,projects(id,name,created_by)')
      .eq('assigned_to', session.user.id)
    const projectTasks = visibleProjectIds.length
      ? await supabase
          .from('tasks')
          .select('id,title,status,assigned_to,project_id,due_date,projects(id,name,created_by)')
          .in('project_id', visibleProjectIds)
      : { data: [] }

    const merged = [...(assigned.data || []), ...(projectTasks.data || [])]
    const uniqueTasks = Object.values(merged.reduce((acc, task) => ({ ...acc, [task.id]: task }), {}))

    setProfile(me || null)
    setUsers(userRows || [])
    setProjects(visibleProjects)
    setTasks(uniqueTasks)
  }, [ensureProfile, session])

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshData().then(() => {})
    }, 0)
    return () => clearTimeout(timer)
  }, [refreshData])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const handleCreateProject = async (name) => {
    if (!supabase || !session?.user) return { ok: false, error: 'Not authenticated' }
    if (!isAdmin) return { ok: false, error: 'Only admin can create projects' }
    const profileResult = await ensureProfile(session.user)
    if (!profileResult.ok) return profileResult

    const { error: insertError } = await supabase
      .from('projects')
      .insert({ name, created_by: session.user.id })
    if (insertError) return { ok: false, error: insertError.message }

    await refreshData()
    return { ok: true }
  }

  const handleCreateTask = async (payload) => {
    if (!supabase || !session?.user) return { ok: false, error: 'Not authenticated' }
    if (!isAdmin) return { ok: false, error: 'Only admin can create tasks' }
    const { error } = await supabase.from('tasks').insert(payload)
    if (error) return { ok: false, error: error.message }
    await refreshData()
    return { ok: true }
  }

  const handleAddMember = async (projectId, userId) => {
    if (!supabase || !session?.user) return { ok: false, error: 'Not authenticated' }
    if (!isAdmin) return { ok: false, error: 'Only admin can manage team members' }
    const { error } = await supabase
      .from('project_members')
      .upsert({ project_id: projectId, user_id: userId }, { onConflict: 'project_id,user_id' })
    if (error) return { ok: false, error: error.message }
    await refreshData()
    return { ok: true }
  }

  const handlePromoteToAdmin = async (userId) => {
    if (!supabase || !session?.user) return { ok: false, error: 'Not authenticated' }
    if (!isAdmin) return { ok: false, error: 'Only admin can grant admin access' }
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId)
    if (error) return { ok: false, error: error.message }
    await refreshData()
    return { ok: true }
  }

  const canToggleTask = (task) => {
    if (isAdmin) return true
    return task.assigned_to === session?.user?.id
  }

  const handleToggleTask = async (task) => {
    if (!supabase || !canToggleTask(task)) return
    const nextStatus = task.status === 'done' ? 'todo' : 'done'
    await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id)
    setTasks((prev) => prev.map((item) => (item.id === task.id ? { ...item, status: nextStatus } : item)))
  }

  if (!hasSupabaseEnv) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <h1 className="text-xl font-semibold text-white">Supabase config missing</h1>
          <p className="mt-2 text-sm text-slate-300">
            Create a <code>.env</code> file in the project root and add:
          </p>
          <pre className="mt-3 rounded-lg bg-slate-950/40 p-3 text-xs text-slate-100">
{`VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...`}
          </pre>
          <p className="mt-3 text-sm text-slate-300">Then restart the dev server.</p>
        </div>
      </main>
    )
  }

  if (!session) return <AuthPage />

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-4 md:p-6">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        role={profile?.role}
      />
      <section className="mt-4">
        {activePage === 'dashboard' ? (
          <DashboardPage tasks={tasks} userMap={userMap} onToggle={handleToggleTask} canToggle={canToggleTask} />
        ) : (
          <ProjectsPage
            projects={projects}
            users={users}
            tasks={tasks}
            userMap={userMap}
            isAdmin={isAdmin}
            onCreateProject={handleCreateProject}
            onCreateTask={handleCreateTask}
            onAddMember={handleAddMember}
          onPromote={handlePromoteToAdmin}
            onToggle={handleToggleTask}
            canToggle={canToggleTask}
          />
        )}
      </section>
    </main>
  )
}

export default App
