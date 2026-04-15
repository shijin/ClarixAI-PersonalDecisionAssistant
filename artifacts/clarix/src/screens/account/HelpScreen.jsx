import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const FAQS = [
  {
    q: "How does Clarix make its recommendations?",
    a: "Clarix uses Claude — an AI built by Anthropic — to analyse your specific situation. It looks at your income, age, goals, and constraints and produces one recommendation anchored in your details. It is not generic advice.",
  },
  {
    q: "How does Clarix make money?",
    a: "Clarix earns only from your subscription. We do not earn commissions, referral fees, or advertising revenue from any financial product we recommend. This means the recommendation is always in your interest.",
  },
  {
    q: "Is this regulated financial advice?",
    a: "No. Clarix is a decision-support tool, not a regulated financial advisor. Use it to inform your decision, not to replace professional advice for complex situations.",
  },
  {
    q: "What data does Clarix store?",
    a: "Clarix stores your situation text, the recommendation, and the reasoning when you choose to save a decision. We never store raw conversation logs or share your data with third parties.",
  },
  {
    q: "Can I delete my data?",
    a: "Yes. You can delete individual decisions from your history at any time. To delete your entire account and all associated data, contact support.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from the Subscription and billing screen. Your access continues until the end of the billing period.",
  },
];

export default function HelpScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      <div className="flex items-center justify-between mb-9">
        <button
          onClick={() => navigate(ROUTES.ACCOUNT)}
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
          Help and about
        </span>
        <div className="w-9" />
      </div>

      <h1
        className="text-[22px] font-extrabold text-ink-100
                     tracking-tight mb-2"
      >
        Help and about
      </h1>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-7">
        Everything you need to know about how Clarix works.
      </p>

      <p className="section-label mb-3">Frequently asked questions</p>
      <div className="flex flex-col gap-3 mb-7">
        {FAQS.map((faq, i) => (
          <div key={i} className="card">
            <p
              className="text-[14px] font-bold text-ink-100 mb-2
                          leading-snug"
            >
              {faq.q}
            </p>
            <p className="text-body-sm text-ink-50 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <p className="section-label mb-3">Contact support</p>
      <button
        onClick={() =>
          window.open(
            "mailto:support@clarix.app?subject=Help with Clarix",
            "_blank",
          )
        }
        className="flex items-center gap-4 px-4 py-3 bg-surface-0
                   border border-[rgba(26,25,23,0.08)] rounded-xl
                   text-left hover:border-[rgba(26,25,23,0.14)]
                   transition-colors duration-150 w-full mb-6"
      >
        <div
          className="w-9 h-9 bg-brand-purple-light rounded-lg
                        flex items-center justify-center flex-shrink-0"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#534AB7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-ink-100">
            Email support
          </p>
          <p className="text-caption text-ink-30">
            support@clarix.app — we reply within 24 hours
          </p>
        </div>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="#9C9A92"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="flex items-center justify-center gap-2 mt-4">
        <div
          className="w-5 h-5 bg-brand-purple rounded-md
                        flex items-center justify-center"
        >
          <svg
            width="11"
            height="11"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className="text-caption text-ink-30">
          Clarix V1.0 · Built with care · No ads · No commissions
        </span>
      </div>
    </div>
  );
}
