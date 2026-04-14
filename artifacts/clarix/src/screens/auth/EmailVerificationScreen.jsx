import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../constants/routes";

export default function EmailVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState(null);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setError(error.message);
      setResending(false);
      return;
    }

    setResent(true);
    setResending(false);

    // Reset the resent confirmation after 5 seconds
    setTimeout(() => setResent(false), 5000);
  };

  const handleOpenEmail = () => {
    // Best-effort attempt to open the email client
    // Works on mobile, silently fails on desktop
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      {/* Nav */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(ROUTES.SIGN_IN)}
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

      <div className="flex-1 flex flex-col">
        {/* Email icon */}
        <div
          className="w-16 h-16 bg-brand-purple-light border
                        border-[rgba(83,74,183,0.2)] rounded-2xl
                        flex items-center justify-center mb-8"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#534AB7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1
                     0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          className="text-[26px] font-extrabold text-ink-100
                       leading-snug tracking-tight mb-3"
        >
          Check your email
        </h1>

        {/* Email address display */}
        {email ? (
          <p className="text-body-sm text-ink-50 leading-relaxed mb-8">
            We sent a sign-in link to{" "}
            <span className="font-semibold text-ink-100">{email}</span>. Tap the
            link in the email to continue.
          </p>
        ) : (
          <p className="text-body-sm text-ink-50 leading-relaxed mb-8">
            We sent a sign-in link to your email address. Tap the link in the
            email to continue.
          </p>
        )}

        {/* What to expect card */}
        <div className="card mb-8">
          <p className="section-label mb-3">What to expect</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 bg-brand-purple-light rounded-full
                              flex items-center justify-center flex-shrink-0
                              mt-[2px]"
              >
                <span className="text-[10px] font-bold text-brand-purple">
                  1
                </span>
              </div>
              <p className="text-body-sm text-ink-80 leading-relaxed">
                Open the email from Clarix in your inbox
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 bg-brand-purple-light rounded-full
                              flex items-center justify-center flex-shrink-0
                              mt-[2px]"
              >
                <span className="text-[10px] font-bold text-brand-purple">
                  2
                </span>
              </div>
              <p className="text-body-sm text-ink-80 leading-relaxed">
                Tap the confirmation link inside
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 bg-brand-purple-light rounded-full
                              flex items-center justify-center flex-shrink-0
                              mt-[2px]"
              >
                <span className="text-[10px] font-bold text-brand-purple">
                  3
                </span>
              </div>
              <p className="text-body-sm text-ink-80 leading-relaxed">
                You will be signed in and your decision will be saved
              </p>
            </div>
          </div>
        </div>

        {/* Success state after resend */}
        {resent && (
          <div
            className="flex items-center gap-3 px-4 py-3
                          bg-brand-teal-light border
                          border-[rgba(15,110,86,0.2)] rounded-xl mb-4"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="#0F6E56"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-body-sm text-brand-teal font-medium">
              Link sent again. Check your inbox.
            </p>
          </div>
        )}

        {/* Error state */}
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

        {/* CTAs */}
        <div className="flex flex-col gap-3 mt-auto">
          <button className="btn-primary" onClick={handleOpenEmail}>
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
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
                       c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Open email app
          </button>

          <button
            className="btn-ghost"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 border-2 border-ink-30
                                border-t-ink-80 rounded-full animate-spin"
                />
                <span>Sending...</span>
              </div>
            ) : (
              "Resend link"
            )}
          </button>

          <button
            className="text-body-sm text-ink-30 text-center py-2"
            onClick={() => navigate(ROUTES.SIGN_IN)}
          >
            Use a different email
          </button>
        </div>
      </div>
    </div>
  );
}
