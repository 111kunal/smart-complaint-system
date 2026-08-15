import { STATUSES, STATUS_STYLES, PRIORITY_DOT, CATEGORY_STYLES } from "../data/constants";

export default function DetailPanel({ complaint, onClose, onStatusChange, onAssign, agentlist=[] }) {
  if (!complaint) return null;
  const filteredlist = agentlist.filter((agent)=>agent.status == "Active")
  return (
    <div className="fixed top-0 right-0 w-96 h-screen bg-white border-l border-gray-200 z-40 overflow-y-auto shadow-2xl">

      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-indigo-600 tracking-wider">{complaint.id}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <h3 className="text-base font-bold text-gray-900 leading-snug">{complaint.title}</h3>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[complaint.status]}`}>
            {complaint.status}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_STYLES[complaint.category] || CATEGORY_STYLES.Other}`}>
            {complaint.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Description */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed">{complaint.description || "No description provided."}</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Submitter</p>
            <p className="text-sm font-semibold text-gray-800">{complaint.submitter}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
            <p className="text-sm text-indigo-600 font-medium break-all">{complaint.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Priority</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[complaint.priority]}`}></span>
              <span className="text-sm font-semibold text-gray-800">{complaint.priority}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Filed on</p>
            <p className="text-sm font-semibold text-gray-800">{complaint.date}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned to</p>
            {/* <p className="text-sm font-semibold text-gray-800">{complaint.agent}</p> */}
            
            {onAssign && <select value={complaint.agent} onChange={(e)=>onAssign(complaint.id, e.target.value)}>
              <option value="Unassigned" >Unassigned</option>
              {filteredlist.map((agent)=>(<option key={agent.id} value={agent.name}>{agent.name}</option>))}
            </select>}
          </div>
        </div>

        {/* Status update */}
        {onStatusChange && <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(complaint.id, s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all
                  ${complaint.status === s
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 bg-white text-gray-500 hover:border-indigo-300"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>}

        {/* Timeline */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Activity</p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 shrink-0"></span>
              <div>
                <p className="text-sm text-gray-700">Complaint filed by {complaint.submitter}</p>
                <p className="text-xs text-gray-400 mt-0.5">{complaint.date}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1 shrink-0"></span>
              <div>
                <p className="text-sm text-gray-700">Assigned to {complaint.agent}</p>
                <p className="text-xs text-gray-400 mt-0.5">{complaint.assignedDate}</p>
              </div>
            </div>
            {complaint.status === "Resolved" && (
              <div className="flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 shrink-0"></span>
                <div>
                  <p className="text-sm text-gray-700">Marked as resolved</p>
                  <p className="text-xs text-gray-400 mt-0.5">Today</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}