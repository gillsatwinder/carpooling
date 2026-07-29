import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const SessionExpiredDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(
    "Your session has expired. Please log in again."
  );

  useEffect(() => {
    const handleSessionExpired = (event) => {
      setMessage(
        event.detail?.message ||
          "Your session has expired. Please log in again."
      );

      setIsOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLogin = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    window.location.href = "/login";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        aria-describedby="session-expired-description"
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>

        <h2
          id="session-expired-title"
          className="text-center text-xl font-bold text-[#16213E]"
        >
          Session Expired
        </h2>

        <p
          id="session-expired-description"
          className="mt-2 text-center text-sm text-slate-500"
        >
          {message}
        </p>

        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 w-full rounded-lg bg-[#16213E] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E2A4A]"
        >
          Go to login
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredDialog;