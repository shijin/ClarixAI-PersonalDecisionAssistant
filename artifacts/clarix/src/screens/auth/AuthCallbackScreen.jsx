import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase puts the session tokens in the URL hash
      // after email verification. We need to exchange them
      // for a real session.
      const { data, error } = await supabase.auth.getSession();

      // Get the returnTo param from the URL if present
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/home";

      if (error || !data.session) {
        // Something went wrong — send to sign in
        navigate("/sign-in");
        return;
      }

      // Session is valid — send user to their destination
      navigate(returnTo);
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
                      border-t-brand-purple rounded-full animate-spin"
      />
      <p className="text-caption text-ink-30">Signing you in...</p>
    </div>
  );
}
