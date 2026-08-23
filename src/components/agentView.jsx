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
          {/* ... keep your existing Name, Email, Password fields exactly as they are ... */}

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