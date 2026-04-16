import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Process the hash tokens from Supabase verification email
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Session error:", error);
            navigate("/sign-in");
            return;
          }
        }

        // Verify session is valid
        const { data } = await supabase.auth.getSession();

        if (!data?.session) {
          navigate("/sign-in");
          return;
        }

        // ── Draft check ──
        // Read draft ID from URL query parameter first
        // This is more reliable than localStorage because
        // it works even when the verification link opens
        // in a different browser or tab
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
            // Restore the recommendation to sessionStorage
            sessionStorage.setItem("clarix_situation", draft.situation);
            sessionStorage.setItem(
              "clarix_recommendation",
              JSON.stringify(draft.recommendation),
            );

            // Clean up the draft ID from localStorage
            localStorage.removeItem("clarix_draft_id");

            // Send user directly to save prompt
            navigate("/save");
            return;
          }
        }

        // No draft — go to returnTo or home
        const returnTo = urlParams.get("returnTo") || "/home";
        navigate(returnTo);
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/sign-in");
      }
    };

    handleCallback();
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
