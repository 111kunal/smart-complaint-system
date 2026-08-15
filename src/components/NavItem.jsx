export default function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 mb-1
        ${active
          ? "bg-indigo-500/20 text-indigo-300 font-semibold border-r-2 border-indigo-400"
          : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
        }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      {badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}