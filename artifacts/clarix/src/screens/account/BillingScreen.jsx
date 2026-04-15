import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function BillingScreen() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.ACCOUNT);
    }
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      {/* Nav */}
      <div className="flex items-center justify-between mb-9">
        <button
          onClick={handleBack}
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
        <span className="text-body-sm font-semibold text-ink-30">
          Subscription
        </span>
        <div className="w-9" />
      </div>

      {/* Current plan card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label mb-1">Current plan</p>
            <div
              className="inline-flex items-center h-6 px-3
                            bg-brand-purple-light rounded-pill"
            >
              <span className="text-[11px] font-bold text-brand-purple-dark">
                Free plan
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="section-label mb-1">Monthly decisions</p>
            <p className="text-[18px] font-bold text-ink-100">3 / 3</p>
          </div>
        </div>

        {/* Usage bar */}
        <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
          <div className="h-full bg-brand-purple rounded-full w-full" />
        </div>
        <p className="text-caption text-ink-30 mt-2">
          Resets on the 1st of next month
        </p>
      </div>

      {/* Coming soon section */}
      <div
        className="flex flex-col items-center justify-center
                      gap-5 py-8"
      >
        {/* Icon */}
        <div
          className="w-14 h-14 bg-brand-purple-light border
                        border-[rgba(83,74,183,0.2)] rounded-2xl
                        flex items-center justify-center"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#534AB7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2
            className="text-[18px] font-extrabold text-ink-100
                         tracking-tight mb-2"
          >
            Clarix Plus — coming soon
          </h2>
          <p className="text-body-sm text-ink-50 leading-relaxed mb-1">
            Unlimited decisions for Rs 199 per month.
          </p>
          <p className="text-body-sm text-ink-50 leading-relaxed">
            Payment via Razorpay will be available in the next update.
          </p>
        </div>

        {/* What Plus includes */}
        <div className="card w-full">
          <p className="section-label mb-3">What Plus includes</p>
          <div className="flex flex-col gap-3">
            {[
              "Unlimited decisions every month",
              "Full decision history saved forever",
              "Context profile for faster decisions",
              "Priority support",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 bg-brand-purple-light rounded-full
                                flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    width="10"
                    height="10"
                    fill="none"
                    stroke="#534AB7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-body-sm text-ink-80">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-col gap-2 w-full">
          {[
            "Cancel anytime. No lock-in, no questions asked.",
            "No ads, no commissions, ever.",
            "Resets on the 1st of every month.",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3
                                    bg-surface-0 border
                                    border-[rgba(26,25,23,0.07)] rounded-xl"
            >
              <div
                className="w-6 h-6 bg-brand-purple-light rounded-lg
                              flex items-center justify-center flex-shrink-0"
              >
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  stroke="#534AB7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="text-[12px] text-ink-80 leading-snug">{text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3">
          {/* Notify me button */}
          <button
            className="btn-primary"
            onClick={() => {
              window.open(
                "mailto:support@clarix.app?subject=Notify me about Clarix Plus",
                "_blank",
              );
            }}
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
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
                       c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Notify me when Plus launches
          </button>

          {/* Back button */}
          <button className="btn-ghost" onClick={handleBack}>
            Back
          </button>
        </div>

        {/* App version note */}
        <p className="text-caption text-ink-30 text-center">
          Clarix V1.0 · Razorpay integration coming in V2
        </p>
      </div>
    </div>
  );
}
