import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../constants/routes";

export default function SignInScreen() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEmailValid = email.includes("@") && email.includes(".");
  const isFormReady =
    isEmailValid && (mode === "magic" ? true : password.length >= 6);

  const handlePasswordSignIn = async () => {
    if (!isFormReady) return;
    setLoading(true);
    setError(null);

    const returnTo = sessionStorage.getItem("clarix_return_to") || ROUTES.HOME;

    // First try signing in
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInData?.session) {
      // Success — existing user signed in
      sessionStorage.removeItem("clarix_return_to");
      navigate(returnTo);
      setLoading(false);
      return;
    }

    // Get the draft ID from localStorage if it exists
    const draftId = localStorage.getItem("clarix_draft_id");

    const redirectUrl = draftId
      ? window.location.origin + "/auth/callback?draft=" + draftId
      : window.location.origin + "/auth/callback";

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      },
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (signUpData?.session) {
      // New user signed up and auto-logged in
      // This happens when email confirmation is OFF
      sessionStorage.removeItem("clarix_return_to");
      navigate(returnTo);
      setLoading(false);
      return;
    }

    if (signUpData?.user?.identities?.length === 0) {
      // Account exists but wrong password
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    // Email confirmation is ON — send to verify screen
    navigate(ROUTES.EMAIL_VERIFY, { state: { email } });
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!isEmailValid) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate(ROUTES.EMAIL_VERIFY, { state: { email } });
    setLoading(false);
  };

  const handleSubmit = () => {
    if (mode === "magic") {
      handleMagicLink();
    } else {
      handlePasswordSignIn();
    }
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                     rounded-[10px] flex items-center justify-center"
          aria-label="Go back"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="#1A1917"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="w-9" />
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-7 h-7 bg-brand-purple rounded-lg
                        flex items-center justify-center flex-shrink-0"
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
        <span className="text-[16px] font-bold text-ink-100 tracking-tight">
          Clarix
        </span>
      </div>

      <h1
        className="text-[26px] font-extrabold text-ink-100
                     leading-snug tracking-tight mb-2"
      >
        Save your decision
      </h1>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-8">
        Sign in to save this recommendation and return to it anytime. No payment
        needed for your first three decisions.
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setMode("password");
            setError(null);
          }}
          className={`flex-1 h-10 rounded-lg text-[13px] font-bold
                      border transition-all duration-150
                      ${
                        mode === "password"
                          ? "bg-brand-purple text-white border-brand-purple"
                          : "bg-surface-0 text-ink-50 border-[rgba(26,25,23,0.1)]"
                      }`}
        >
          Email and password
        </button>
        <button
          onClick={() => {
            setMode("magic");
            setError(null);
          }}
          className={`flex-1 h-10 rounded-lg text-[13px] font-bold
                      border transition-all duration-150
                      ${
                        mode === "magic"
                          ? "bg-brand-purple text-white border-brand-purple"
                          : "bg-surface-0 text-ink-50 border-[rgba(26,25,23,0.1)]"
                      }`}
        >
          Magic link
        </button>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <label className="text-label text-ink-80">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="you@example.com"
          autoComplete="email"
          className="input-field"
        />
      </div>

      {mode === "password" && (
        <div className="flex flex-col gap-1 mb-6">
          <label className="text-label text-ink-80">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="At least 6 characters"
            autoComplete="current-password"
            className="input-field"
          />
        </div>
      )}

      {mode === "magic" && (
        <p className="text-body-sm text-ink-50 mb-6 leading-relaxed">
          We will send a one-tap sign-in link to your email. No password needed.
        </p>
      )}

      {error && (
        <div
          className="flex items-start gap-2 px-4 py-3
                        bg-semantic-error-bg border
                        border-[rgba(163,45,45,0.2)] rounded-xl mb-4"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#A32D2D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            className="flex-shrink-0 mt-[2px]"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-body-sm text-semantic-error-dark leading-relaxed">
            {error}
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isFormReady || loading}
        className="btn-primary mb-4"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 border-2 border-white
                            border-t-transparent rounded-full animate-spin"
            />
            <span>
              {mode === "magic" ? "Sending link..." : "Signing in..."}
            </span>
          </div>
        ) : mode === "magic" ? (
          "Send magic link"
        ) : (
          "Sign in"
        )}
      </button>

      <p
        className="text-caption text-ink-30 text-center
                    leading-relaxed mt-auto"
      >
        By continuing you agree to our Terms of Service. We never sell your data
        or show you ads.
      </p>
    </div>
  );
}
