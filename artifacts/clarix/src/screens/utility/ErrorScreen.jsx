import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function ErrorScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const message = location.state?.message || null;
  const returnTo = location.state?.returnTo || null;
  const canRetry = location.state?.canRetry ?? true;

  const handleRetry = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate(-1);
    }
  };

  const handleGoHome = () => {
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      {/* Nav */}
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

      <div
        className="flex-1 flex flex-col items-center
                      justify-center gap-6"
      >
        {/* Error icon */}
        <div
          className="w-16 h-16 bg-semantic-error-bg border
                        border-[rgba(163,45,45,0.2)] rounded-2xl
                        flex items-center justify-center"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#A32D2D"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1
            className="text-[22px] font-extrabold text-ink-100
                         tracking-tight mb-3"
          >
            Something went wrong
          </h1>
          <p className="text-body-sm text-ink-50 leading-relaxed">
            {message || "An unexpected error occurred. This is on us, not you."}
          </p>
        </div>

        {/* Context saved notice */}
        <div
          className="flex items-center gap-2 px-4 py-3
                        bg-brand-teal-light border
                        border-[rgba(15,110,86,0.2)] rounded-xl w-full"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#0F6E56"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            className="flex-shrink-0"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-body-sm text-brand-teal font-medium">
            Your context and situation were saved
          </p>
        </div>

        {/* What to try */}
        <div className="card w-full">
          <p className="section-label mb-3">What you can try</p>
          <div className="flex flex-col gap-3">
            {[
              "Check your internet connection and try again",
              "Refresh the page if the problem persists",
              "If this keeps happening, contact support",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 bg-surface-2 rounded-full
                                flex items-center justify-center
                                flex-shrink-0 mt-[1px]"
                >
                  <span className="text-[10px] font-bold text-ink-50">
                    {i + 1}
                  </span>
                </div>
                <p className="text-body-sm text-ink-80 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3">
          {canRetry && (
            <button className="btn-primary" onClick={handleRetry}>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Try again
            </button>
          )}
          <button className="btn-ghost" onClick={handleGoHome}>
            Go to home page
          </button>
        </div>
      </div>

      {/* Support link */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="#9C9A92"
          strokeWidth="2"
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
        <button
          onClick={() => (window.location.href = "mailto:support@clarix.app")}
          className="text-caption text-ink-30 hover:text-ink-80
                     transition-colors duration-150"
        >
          Contact support
        </button>
      </div>
    </div>
  );
}
