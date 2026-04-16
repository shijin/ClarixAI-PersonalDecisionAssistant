import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackScreen() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setMessage("Signing you in...");

        // Give Supabase time to process the URL hash
        // and establish the session automatically
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if session was established
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("No session after callback:", error);
          // Try one more time after another delay
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();

          if (!retrySession) {
            navigate("/sign-in");
            return;
          }
        }

        setMessage("Almost there...");

        // Read draft ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const draftId =
          urlParams.get("draft") || localStorage.getItem("clarix_draft_id");

        if (draftId) {
          const { data: draft, error: draftError } = await supabase
            .from("drafts")
            .select("*")
            .eq("session_id", draftId)
            .single();

          if (!draftError && draft) {
            // Restore recommendation to sessionStorage
            sessionStorage.setItem("clarix_situation", draft.situation);
            sessionStorage.setItem(
              "clarix_recommendation",
              JSON.stringify(draft.recommendation),
            );

            // Clean up
            localStorage.removeItem("clarix_draft_id");

            setMessage("Loading your recommendation...");
            navigate("/save");
            return;
          }
        }

        // No draft — go home
        navigate("/home");
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/sign-in");
      }
    };

    // Listen for auth state changes as a backup
    // This fires when Supabase auto-processes the URL hash
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();

        const urlParams = new URLSearchParams(window.location.search);
        const draftId =
          urlParams.get("draft") || localStorage.getItem("clarix_draft_id");

        if (draftId) {
          const { data: draft, error: draftError } = await supabase
            .from("drafts")
            .select("*")
            .eq("session_id", draftId)
            .single();

          if (!draftError && draft) {
            sessionStorage.setItem("clarix_situation", draft.situation);
            sessionStorage.setItem(
              "clarix_recommendation",
              JSON.stringify(draft.recommendation),
            );
            localStorage.removeItem("clarix_draft_id");
            navigate("/save");
            return;
          }
        }

        navigate("/home");
      }
    });

    handleCallback();

    return () => {
      subscription.unsubscribe();
    };
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
      <p className="text-caption text-ink-30">{message}</p>
    </div>
  );
}
