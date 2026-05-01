export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur">
      <p className="text-xs uppercase tracking-wider text-slate-300">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  )
}
