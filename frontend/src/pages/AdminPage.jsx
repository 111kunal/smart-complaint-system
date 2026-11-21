import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchComplaints,
  setSelected,
  setStatusFilter,
  setSearch,
  updateComplaintStatus,
  assignComplaintToAgent,
  closeComplaint,
  reopenComplaint,
  deleteComplaint,
  clearSuccessMsg,
} from "../features/complaint/complaintSlice";
import { fetchAgents } from "../features/complaint/agentSlice";

import { FILTER_STATUSES, STATUS_STYLES, PRIORITY_DOT, CATEGORY_STYLES } from "../data/constants";
import NavItem from "../components/NavItem";
import MetricCard from "../components/MetricCard";
import DetailPanel from "../components/DetailPanel";
import AgentsView from "../components/AgentsView";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  dispatch(fetchComplaints());
  dispatch(fetchAgents()); // load once here so the Agents tab and the assign dropdown share it
}, [dispatch]);

  const complaints = useSelector((state) => state.complaints.list);
  const statusFilter = useSelector((state) => state.complaints.statusFilter);
  const search = useSelector((state) => state.complaints.search);
  const selected = useSelector((state) => state.complaints.selected);
  const successMsg = useSelector((state) => state.complaints.successMsg);
  const agentlist = useSelector((state)=>state.agents.list);

  const [activeNav, setActiveNav] = useState("dashboard");

  // pending confirmation: { type: "close" | "reopen" | "delete", complaint } (null = hidden)
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const CONFIRM_ACTIONS = {
    close:  { thunk: closeComplaint,  title: "Close this complaint?",  confirmLabel: "Confirm", busyLabel: "Closing…",
              text: "will be marked as Closed and locked. You can reopen it later from this list." },
    reopen: { thunk: reopenComplaint, title: "Reopen this complaint?", confirmLabel: "Reopen",  busyLabel: "Reopening…",
              text: "will be reopened and restored to the status it had before it was closed.", danger: false },
    delete: { thunk: deleteComplaint, title: "Delete this complaint?", confirmLabel: "Delete",  busyLabel: "Deleting…",
              text: "will be permanently deleted. This cannot be undone." },
  };
  const confirmAction = confirm && CONFIRM_ACTIONS[confirm.type];

  const handleConfirm = async () => {
    setBusy(true);
    await dispatch(confirmAction.thunk(confirm.complaint._id));
    setBusy(false);
    setConfirm(null);
  };

  // auto-clear the success banner after 4 seconds
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => dispatch(clearSuccessMsg()), 4000);
    return () => clearTimeout(timer);
  }, [successMsg, dispatch]);

  // ── Derived counts ───────────────────────────────────────────────
  const openCount = complaints.filter((c) => c.status === "Open").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;
  const resolutionRate = complaints.length
    ? Math.round((resolvedCount / complaints.length) * 100)
    : 0;

  // ── Filtered list ────────────────────────────────────────────────
  const filtered = complaints.filter((c) => {
  const matchStatus = statusFilter === "All" || c.status === statusFilter;
  const matchSearch =
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.submitter?.name || "").toLowerCase().includes(search.toLowerCase());
  return matchStatus && matchSearch;
});

  // ── Nav items ────────────────────────────────────────────────────
  const mainNav = [{ id: "dashboard", icon: "⬛", label: "Dashboard" }];
  const adminNav = [{ id: "agents", icon: "👥", label: "Agents" }];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="w-60 bg-slate-900 flex flex-col py-6 sticky top-0 h-screen shrink-0">
        <div className="px-6 pb-5 border-b border-slate-700">
          <div className="text-lg font-bold text-slate-100 tracking-tight">ResolveIQ</div>
          <div className="text-xs text-slate-500 mt-0.5">Complaint Management</div>
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

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-6">Admin</p>
          {adminNav.map((item) => (
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
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-7 py-4 flex items-center gap-3 sticky top-0 z-30">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">
              {activeNav === "agents" ? "Agents" : "Dashboard"}
            </h1>
          </div>

          {/* Complaint search/export only make sense on the dashboard */}
          {activeNav === "dashboard" && (
            <>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 w-56"
                placeholder="🔍  Search complaints…"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
              <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Export
              </button>
            </>
          )}

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate("/")}}
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-7 overflow-y-auto">
          {/* ── AGENTS VIEW ──────────────────────────────────────── */}
          {activeNav === "agents" && <AgentsView />}

          {/* ── DASHBOARD VIEW ───────────────────────────────────── */}
          {activeNav === "dashboard" && (
            <>
              {/* Success banner */}
              {successMsg && (
                <div className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                  <span>✓</span> {successMsg}
                </div>
              )}

              {/* Metric cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <MetricCard label="Total Complaints" value={complaints.length} borderColor="border-indigo-500" sub="All time" />
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
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 px-5 py-3 border-b border-gray-100">
                  {["All", ...FILTER_STATUSES].map((s) => (
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
                        {["Complaint", "Category", "Priority", "Status", "Agent", "Filed", "Actions", ""].map((h) => (
                          <th
                            key={h}
                            className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center text-gray-400 py-12 text-sm">
                            No complaints found.
                          </td>
                        </tr>
                      )}
                      {filtered.map((c) => (
                        <tr
                          key={c._id}
                          onClick={() => dispatch(setSelected(c))}
                          className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50
                            ${selected?._id === c._id ? "bg-indigo-50" : ""}`}
                        >
                          <td className="px-5 py-4">
                            <div className="text-sm font-semibold text-gray-900">{c.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{c.submitter?.name || "Unknown"}</div>
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
                          <td className="px-5 py-4 text-sm text-gray-600">{c.assignedAgent?.name || "Unassigned"}</td>
                          <td className="px-5 py-4 text-xs text-gray-400">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {c.status === "Closed" ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setConfirm({ type: "reopen", complaint: c }); }}
                                  title="Undo close and restore the previous status"
                                  className="border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                >
                                  ↺ Reopen
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setConfirm({ type: "close", complaint: c }); }}
                                  className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  Close
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirm({ type: "delete", complaint: c }); }}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
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
            </>
          )}
        </main>
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirmAction.title}
          message={<>
            <span className="font-semibold">"{confirm.complaint.title}"</span> {confirmAction.text}
          </>}
          confirmLabel={confirmAction.confirmLabel}
          busyLabel={confirmAction.busyLabel}
          danger={confirmAction.danger !== false}
          busy={busy}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      {selected && (
        <DetailPanel
          complaint={selected}
          onClose={() => dispatch(setSelected(null))}
          onStatusChange={(id, newStatus) => dispatch(updateComplaintStatus({ id, newStatus }))}
          onAssign={(id,agentId) => dispatch(assignComplaintToAgent({id,agentId}))}
          agentlist = {agentlist}
        />
      )}
    </div>
  );
}