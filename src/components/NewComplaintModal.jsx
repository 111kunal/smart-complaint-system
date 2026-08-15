import { useForm } from "react-hook-form";
import { CATEGORIES, PRIORITIES } from "../data/constants";

export default function NewComplaintModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "Billing",
      priority: "Medium",
      submitter: "",
      email: "",
      orderId: "",
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900">File a New Complaint</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-7 py-5 flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                errors.title ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="Short description of your issue"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none min-h-22.5"
              placeholder="Describe the issue in detail…"
              {...register("description")}
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400"
                {...register("category")}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400"
                {...register("priority")}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                  errors.submitter ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Full name"
                {...register("submitter", { required: "Name is required" })}
              />
              {errors.submitter && (
                <p className="text-red-500 text-xs mt-1">{errors.submitter.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Order ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Order / Transaction ID{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. ORD-20240413"
              {...register("orderId")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-1"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}