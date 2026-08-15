import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
 
import {
  setSelected,
  setStatusFilter,
  setSearch,
  updateStatus,
} from "../features/complaint/complaintSlice";
 
import { STATUSES, STATUS_STYLES, PRIORITY_DOT, CATEGORY_STYLES } from "../data/constants";
import NavItem from "../components/NavItem";
import MetricCard from "../components/MetricCard";
import DetailPanel from "../components/DetailPanel";
 
export default function Agent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const complaints = useSelector((state) => state.complaints.list);
  const statusFilter = useSelector((state) => state.complaints.statusFilter);
  const search = useSelector((state) => state.complaints.search);
  const selected = useSelector((state) => state.complaints.selected);
 
  const [activeNav, setActiveNav] = useState("queue");
 
  // NOTE: once you wire up login/current-agent, swap this for:
  //   complaints.filter((c) => c.agent === currentAgent.name)
  // For now the agent sees the full queue.
  const queue = complaints;
 
  // ── Derived counts (this agent's queue) ──────────────────────────
  const openCount = queue.filter((c) => c.status === "Open").length;
  const inProgressCount = queue.filter((c) => c.status === "In Progress").length;
  const resolvedCount = queue.filter((c) => c.status === "Resolved").length;
  const resolutionRate = queue.length
    ? Math.round((resolvedCount / queue.length) * 100)
    : 0;
 
  // ── Filtered list ────────────────────────────────────────────────
  const filtered = queue.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.submitter.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
 
  const mainNav = [{ id: "queue", icon: "📋", label: "My Queue" }];
 
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="w-60 bg-slate-900 flex flex-col py-6 sticky top-0 h-screen shrink-0">
        <div className="px-6 pb-5 border-b border-slate-700">
          <div className="text-lg font-bold text-slate-100 tracking-tight">ResolveIQ</div>
          <div className="text-xs text-slate-500 mt-0.5">Agent Workspace</div>
        </div>
        <nav className="px-3 mt-5 flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Main</p>
          {mainNav.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={activeNav === item.id}
              onClick={() => {
                setActiveNav(item.id);
                dispatch(setSelected(null));
              }}
            />
          ))}
        </nav>
      </aside>
 
      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-7 py-4 flex items-center gap-3 sticky top-0 z-30">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">My Queue</h1>
          </div>
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 w-56"
            placeholder="🔍  Search complaints…"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </header>
 
        <main className="flex-1 p-7 overflow-y-auto">
          {/* Metric cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <MetricCard label="Assigned to Me" value={queue.length} borderColor="border-indigo-500" sub="Total in queue" />
            <MetricCard label="Open" value={openCount} borderColor="border-red-400" sub="Needs attention" />
            <MetricCard label="In Progress" value={inProgressCount} borderColor="border-yellow-400" sub="Being handled" />
            <MetricCard label="Resolved" value={resolvedCount} borderColor="border-green-500" sub={`${resolutionRate}% resolution rate`} />
          </div>
 
          {/* Complaint table card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Complaints <span className="text-gray-400 font-normal">({filtered.length})</span>
              </h2>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 outline-none"
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              >
                <option value="All">All Status</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
 
            {/* Filter tabs */}
            <div className="flex gap-1 px-5 py-3 border-b border-gray-100">
              {["All", ...STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => dispatch(setStatusFilter(s))}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all font-medium
                    ${statusFilter === s
                      ? "bg-indigo-100 text-indigo-700 font-bold"
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
 
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["ID", "Complaint", "Category", "Priority", "Status", "Filed", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                        No complaints found.
                      </td>
                    </tr>
                  )}
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => dispatch(setSelected(c))}
                      className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50
                        ${selected?.id === c.id ? "bg-indigo-50" : ""}`}
                    >
                      <td className="px-5 py-4 text-xs font-bold text-gray-400">{c.id}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-900">{c.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{c.submitter}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[c.category] || CATEGORY_STYLES.Other}`}>
                          {c.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[c.priority]}`}></span>
                          <span className="text-sm text-gray-600">{c.priority}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{c.date}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); dispatch(setSelected(c)); }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
 
      {/* Agents update complaint status from the detail panel */}
      {selected && (
        <DetailPanel
          complaint={selected}
          onClose={() => dispatch(setSelected(null))}
          onStatusChange={(id, newStatus) => dispatch(updateStatus({ id, newStatus }))}
        />
      )}
    </div>
  );
}