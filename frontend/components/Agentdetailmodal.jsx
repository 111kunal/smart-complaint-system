// status → badge colors (mirrors STATUS_STYLES in constants)
const STATUS_BADGE = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Pending: "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
};

// ── Small stat card used inside the agent detail modal ──────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${color}`}>
      <div className="text-2xl font-extrabold leading-none">{value}</div>
      <div className="text-xs font-semibold mt-1 opacity-80">{label}</div>
    </div>
  );
}

// ── Agent detail modal: shows this agent's complaint counts + list ──────────
export default function AgentDetailModal({ agent, complaints, onClose }) {
  // complaints assigned to this agent (matched by name)
  const agentComplaints = complaints.filter((c) => c.agent === agent.name);

  const total = agentComplaints.length;
  const openCount = agentComplaints.filter((c) => c.status === "Open").length;
  const inProgressCount = agentComplaints.filter((c) => c.status === "In Progress").length;
  const pendingCount = agentComplaints.filter((c) => c.status === "Pending").length;
  const resolvedCount = agentComplaints.filter((c) => c.status === "Resolved").length;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-400">{agent.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="px-7 py-6">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-extrabold text-gray-900">{total}</span>
            <span className="text-sm font-semibold text-gray-400">
              total complaint{total === 1 ? "" : "s"} assigned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Open" value={openCount} color="bg-red-50 border-red-200 text-red-700" />
            <StatCard label="In Progress" value={inProgressCount} color="bg-yellow-50 border-yellow-200 text-yellow-700" />
            <StatCard label="Pending" value={pendingCount} color="bg-blue-50 border-blue-200 text-blue-700" />
            <StatCard label="Resolved" value={resolvedCount} color="bg-green-50 border-green-200 text-green-700" />
          </div>

          {/* Complaint list */}
          {total > 0 ? (
            <div className="mt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Assigned Complaints
              </h3>
              <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
                {agentComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{c.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {c.id} · {c.category}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        STATUS_BADGE[c.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm mt-5">
              No complaints assigned to this agent yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}