import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function NotificationsScreen() {
  const navigate = useNavigate();

  const [emailReminders, setEmailReminders] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  const Toggle = ({ value, onChange, label, sublabel }) => (
    <div
      className="flex items-center justify-between gap-4 px-4 py-4
                    bg-surface-0 border border-[rgba(26,25,23,0.08)]
                    rounded-xl"
    >
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-[14px] font-semibold text-ink-100">{label}</p>
        {sublabel && <p className="text-caption text-ink-30">{sublabel}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors
                    duration-200 flex-shrink-0
                    ${value ? "bg-brand-purple" : "bg-surface-3"}`}
        aria-label={label}
      >
        <div
          className={`absolute top-[2px] w-5 h-5 bg-white rounded-full
                         shadow-sm transition-transform duration-200
                         ${value ? "translate-x-5" : "translate-x-[2px]"}`}
        />
      </button>
    </div>
  );

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
          Notifications
        </span>
        <div className="w-9" />
      </div>

      <h1
        className="text-[22px] font-extrabold text-ink-100
                     tracking-tight mb-2"
      >
        Notifications
      </h1>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-7">
        Choose what Clarix sends to your email. We never send promotional or
        sponsored content.
      </p>

      <p className="section-label mb-3">Email preferences</p>
      <div className="flex flex-col gap-3">
        <Toggle
          value={emailReminders}
          onChange={setEmailReminders}
          label="Decision reminders"
          sublabel="Remind me about decisions I started but did not finish"
        />
        <Toggle
          value={productUpdates}
          onChange={setProductUpdates}
          label="Product updates"
          sublabel="New features and improvements to Clarix"
        />
      </div>

      <div className="card mt-6">
        <p className="text-body-sm text-ink-50 leading-relaxed">
          We will never send you ads, sponsored content, or share your email
          with third parties. Your inbox is yours.
        </p>
      </div>
    </div>
  );
}
