import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallbackScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if draft cookies were set by the Edge Function
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, val] = cookie.trim().split("=");
      acc[key] = val;
      return acc;
    }, {});

    const hasDraft = cookies["clarix_draft_situation"];

    if (hasDraft) {
      navigate("/save");
    } else {
      navigate("/home");
    }
  }, []);

  return (
    <div
      className="min-h-dvh bg-surface-1 flex flex-col
                    items-center justify-center gap-4"
    >
      <div
        className="w-7 h-7 bg-brand-purple rounded-lg
                      flex items-center justify-center"
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1
                   2-2h14a2 2 0 0 1 2 2z"
          />
        </svg>
      </div>
      <div
        className="w-5 h-5 border-2 border-surface-3
                      border-t-brand-purple rounded-full
                      animate-spin"
      />
      <p className="text-caption text-ink-30">Signing you in...</p>
    </div>
  );
}
