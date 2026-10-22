import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAgents,
  toggleAgentStatus,
  removeAgent,
  setAgentSearch,
  setAgentModal,
} from "../features/complaint/agentSlice";
import AgentDetailModal from "./temp";

// ── Add Agent modal ──────────────────────────────────────────────────────
function AddAgentModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", password: "" } });

  const [apiError, setApiError] = useState("");

  const handleFormSubmit = async (data) => {
    setApiError("");
    try {
      await onSubmit(data);
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900">Add New Agent</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-7 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                errors.name ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="e.g. Priya Sharma"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="agent@resolveiq.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="At least 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {apiError && (
            <p className="text-red-500 text-sm text-center -mt-1">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-1 disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add Agent"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Agents management view ──────────────────────────────────────────────────
export default function AgentsView() {
  const dispatch = useDispatch();
  const complaints = useSelector((state) => state.complaints.list);
  const agents = useSelector((state) => state.agents.list);
  const search = useSelector((state) => state.agents.search);
  const showModal = useSelector((state) => state.agents.showModal);
  const loading = useSelector((state) => state.agents.loading);

  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = agents.filter((a) => a.status === "Active").length;

  // total complaint count for a given agent (used in the table column)
  const countFor = (name) => complaints.filter((c) => c.agent === name).length;

  const handleAddAgent = async (data) => {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:5000/api/admin/create-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to add agent');
    }

    dispatch(setAgentModal(false));
    dispatch(fetchAgents()); // refetch the real list instead of faking a local entry
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Agents</h2>
          <p className="text-sm text-gray-400">
            {agents.length} total · {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 w-56"
            placeholder="🔍  Search agents…"
            value={search}
            onChange={(e) => dispatch(setAgentSearch(e.target.value))}
          />
          <button
            onClick={() => dispatch(setAgentModal(true))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Agent
          </button>
        </div>
      </div>

      {/* Agents table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Name", "Email", "Complaints", "Status", ""].map((h) => (
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
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12 text-sm">
                    Loading agents...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12 text-sm">
                    No agents found.
                  </td>
                </tr>
              )}
              {!loading && filtered.map((a) => (
                <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{a.name}</td>
                  <td className="px-5 py-4 text-sm text-indigo-600 break-all">{a.email}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center min-w-8 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-full px-2.5 py-1">
                      {countFor(a.name)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        a.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => dispatch(toggleAgentStatus(a._id))}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold cursor-pointer"
                      >
                        {a.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => dispatch(removeAgent(a._id))}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold cursor-pointer"
                        onClick={() => setSelectedAgent(a)}
                      >
                        Info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddAgentModal
          onClose={() => dispatch(setAgentModal(false))}
          onSubmit={handleAddAgent}
        />
      )}

      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          complaints={complaints}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </>
  );
}