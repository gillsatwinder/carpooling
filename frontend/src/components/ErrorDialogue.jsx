import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorDialogue = ({
  open,
  title = "Error",
  message = "An error occurred while processing your request.",
}) => {
  const navigate = useNavigate();

  if (!open) return null;

  const handleClose = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle
            className="text-red-500 mb-4"
            size={52}
          />

          <h2 className="text-2xl font-bold text-[#16213E]">
            {title}
          </h2>

          <p className="text-gray-600 mt-3">
            {message}
          </p>

          <button
            onClick={handleClose}
            className="mt-6 bg-[#16213E] text-white px-6 py-3 rounded-xl hover:bg-[#1c2d55]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialogue;