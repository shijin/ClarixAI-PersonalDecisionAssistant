import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const FEATURES_FREE = [
  "3 complete decisions per month",
  "Full reasoning and trade-off analysis",
  "Assumption flagging and correction",
  "Follow-up conversation",
  "Share recommendations",
];

const FEATURES_PAID = [
  "Unlimited decisions every month",
  "Full reasoning and trade-off analysis",
  "Assumption flagging and correction",
  "Follow-up conversation",
  "Share recommendations",
  "Decision history — save and revisit anytime",
  "Context profile — faster decisions over time",
  "Priority support",
];

export default function UpgradeScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDismiss = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.BILLING);
    }, 1000);
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      <div className="flex items-center justify-between mb-8">
        <div className="w-9" />
        <button
          onClick={handleDismiss}
          className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                     rounded-[10px] flex items-center justify-center"
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#1A1917"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="text-center mb-8">
        <div
          className="w-14 h-14 bg-brand-purple rounded-2xl
                        flex items-center justify-center mx-auto mb-5"
        >
          <svg
            width="26"
            height="26"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h1
          className="text-[24px] font-extrabold text-ink-100
                       tracking-tight mb-3"
        >
          You have used your free decisions this month
        </h1>
        <p className="text-body-sm text-ink-50 leading-relaxed">
          Upgrade to Clarix Plus for unlimited decisions, saved history, and
          faster recommendations every month.
        </p>
      </div>

      <div className="flex gap-3 mb-7">
        <div
          className="flex-1 bg-surface-0 border
                        border-[rgba(26,25,23,0.08)] rounded-xl p-4"
        >
          <p
            className="text-[11px] font-bold text-ink-30 uppercase
                        tracking-[0.06em] mb-1"
          >
            Free
          </p>
          <p className="text-[20px] font-extrabold text-ink-100 mb-3">
            Rs 0
            <span className="text-[13px] font-normal text-ink-30">/month</span>
          </p>
          <div className="flex flex-col gap-2">
            {FEATURES_FREE.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#9C9A92"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0 mt-[2px]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-[12px] text-ink-50 leading-snug">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex-1 bg-brand-purple border
                        border-brand-purple rounded-xl p-4
                        relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 bg-brand-teal-mid
                          px-3 py-1 rounded-bl-xl"
          >
            <p
              className="text-[9px] font-bold text-white uppercase
                          tracking-[0.06em]"
            >
              Recommended
            </p>
          </div>
          <p
            className="text-[11px] font-bold text-[rgba(255,255,255,0.6)]
                        uppercase tracking-[0.06em] mb-1"
          >
            Plus
          </p>
          <p className="text-[20px] font-extrabold text-white mb-3">
            Rs 199
            <span
              className="text-[13px] font-normal
                             text-[rgba(255,255,255,0.6)]"
            >
              /month
            </span>
          </p>
          <div className="flex flex-col gap-2">
            {FEATURES_PAID.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="flex-shrink-0 mt-[2px]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p
                  className="text-[12px] text-[rgba(255,255,255,0.85)]
                               leading-snug"
                >
                  {f}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-7">
        {[
          {
            icon: "shield",
            text: "Cancel anytime. No lock-in, no questions asked.",
          },
          {
            icon: "heart",
            text: "No ads, no commissions, ever. We only earn from your subscription.",
          },
          { icon: "refresh", text: "Resets on the 1st of every month." },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3
                                  bg-surface-0 border
                                  border-[rgba(26,25,23,0.07)] rounded-xl"
          >
            <div
              className="w-7 h-7 bg-brand-purple-light rounded-lg
                            flex items-center justify-center flex-shrink-0"
            >
              {item.icon === "shield" && (
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="#534AB7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
              {item.icon === "heart" && (
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="#534AB7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
              {item.icon === "refresh" && (
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="#534AB7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              )}
            </div>
            <p className="text-[12px] text-ink-80 leading-snug flex-1">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <button
          className="btn-primary"
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 border-2 border-white
                              border-t-transparent rounded-full
                              animate-spin"
              />
              <span>Setting up upgrade...</span>
            </div>
          ) : (
            <>
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
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Upgrade to Plus — Rs 199/month
            </>
          )}
        </button>
        <button className="btn-ghost" onClick={handleDismiss}>
          Continue with free plan
        </button>
        <p className="text-caption text-ink-30 text-center">
          Payment processed securely via Razorpay
        </p>
      </div>
    </div>
  );
}
