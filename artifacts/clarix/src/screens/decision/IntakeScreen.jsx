import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { ROUTES } from "../../constants/routes";

const STARTERS = [
  "Which insurance plan is right for me?",
  "Should I take the new job offer?",
  "How should I invest my savings?",
  "Should I rent or buy right now?",
  "How do I prioritise my financial goals?",
];

export default function IntakeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const MAX = 500;

  const cameFromRecommendation = location.state?.fromRecommendation === true;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sessionStorage.setItem("clarix_situation", trimmed);
    sessionStorage.removeItem("clarix_recommendation");
    navigate(ROUTES.RECOMMENDATION);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleStarter = (s) => {
    setText(s);
    textareaRef.current?.focus();
  };

  const handleBack = () => {
    if (cameFromRecommendation) {
      navigate(ROUTES.RECOMMENDATION);
      return;
    }

    const backTo = sessionStorage.getItem("clarix_back_to");
    if (backTo === "home") {
      sessionStorage.removeItem("clarix_back_to");
      navigate(ROUTES.HOME);
      return;
    }

    if (user) {
      navigate(ROUTES.HOME);
      return;
    }

    navigate(ROUTES.LANDING);
  };

  const remaining = MAX - text.length;
  const isReady = text.trim().length > 10;

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

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
          New decision
        </span>
        <div className="w-9" />
      </div>

      <h1
        className="text-[26px] font-extrabold text-ink-100 leading-snug
                     tracking-tight mb-2"
      >
        What are you trying to decide?
      </h1>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-8">
        Describe it in your own words. The more specific you are, the more
        useful the answer.
      </p>

      <div
        className={`bg-surface-0 rounded-2xl p-4 mb-3
                    transition-all duration-150
                    ${
                      focused
                        ? "border-[1.5px] border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.1)]"
                        : "border-[1.5px] border-[rgba(26,25,23,0.12)]"
                    }`}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. I need to buy term insurance. I am 27, earn Rs 68,000 a month in Pune, no dependents. Not sure which plan to go with or how much cover I need."
          rows={5}
          className="w-full bg-transparent text-[15px] text-ink-100
                     placeholder-ink-30 leading-relaxed resize-none
                     outline-none border-none font-sans"
        />
        <div className="flex items-center justify-between mt-3">
          <span
            className={`text-caption
                            ${
                              remaining < 50
                                ? "text-semantic-warning"
                                : "text-ink-30"
                            }`}
          >
            {text.length} / {MAX}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!isReady}
            className={`w-10 h-10 rounded-[10px] flex items-center
                        justify-center transition-colors duration-150
                        ${
                          isReady
                            ? "bg-brand-purple cursor-pointer"
                            : "bg-surface-3 cursor-not-allowed"
                        }`}
            aria-label="Submit"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke={isReady ? "white" : "#9C9A92"}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className="w-1 h-1 rounded-full bg-ink-30" />
        <span className="text-caption text-ink-30">
          No sign-up needed to get your recommendation
        </span>
      </div>

      <p className="section-label mb-3">Common decisions</p>
      <div className="flex flex-col">
        {STARTERS.map((s, i) => (
          <button
            key={i}
            onClick={() => handleStarter(s)}
            className="flex items-center justify-between gap-3 py-[13px]
                       border-b border-[rgba(26,25,23,0.06)] last:border-b-0
                       text-left group"
          >
            <span
              className="text-[14px] font-medium text-ink-80
                             group-hover:text-ink-100 transition-colors
                             leading-snug"
            >
              {s}
            </span>
            <div
              className="w-6 h-6 border border-[rgba(26,25,23,0.1)]
                            rounded-[7px] flex items-center justify-center
                            flex-shrink-0 group-hover:border-[rgba(26,25,23,0.2)]
                            transition-colors"
            >
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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-start gap-3 mt-auto pt-8">
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="#1D9E75"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="flex-shrink-0 mt-[2px]"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-caption text-ink-30 leading-relaxed">
          <span className="font-semibold text-ink-100">
            Your context stays private.
          </span>{" "}
          We never sell or share what you tell us. No ads. No commissions.
        </p>
      </div>
    </div>
  );
}
