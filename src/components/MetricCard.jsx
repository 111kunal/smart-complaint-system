export default function MetricCard({ label, value, sub, borderColor }) {
  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${borderColor}`}>
      <div className="text-3xl font-extrabold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-xs font-semibold mt-1 text-gray-400">{sub}</div>}
    </div>
  );
}