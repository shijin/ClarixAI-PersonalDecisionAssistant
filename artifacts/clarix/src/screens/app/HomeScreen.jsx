import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useDecision } from "../../hooks/useDecision";
import { ROUTES } from "../../constants/routes";
import BottomNav from "../../components/layout/BottomNav";

const DECISION_TYPE_LABELS = {
  insurance: "Insurance",
  investment: "Investment",
  career: "Career",
  purchase: "Purchase",
  housing: "Housing",
  other: "Decision",
};

const DECISION_TYPE_COLORS = {
  insurance: "border-l-brand-purple",
  investment: "border-l-brand-teal-mid",
  career: "border-l-[#BA7517]",
  purchase: "border-l-ink-30",
  housing: "border-l-[#185FA5]",
  other: "border-l-ink-30",
};

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { fetchDecisions } = useDecision();

  const [decisions, setDecisions] = useState([]);
  const [loadingDecisions, setLoadingDecisions] = useState(true);
  const [inputText, setInputText] = useState("");

  const firstName = user?.email?.split("@")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    setLoadingDecisions(true);
    const data = await fetchDecisions();
    setDecisions(data.slice(0, 4));
    setLoadingDecisions(false);
  };

  const handleStartDecision = () => {
    if (inputText.trim().length > 0) {
      sessionStorage.setItem("clarix_situation", inputText.trim());
      sessionStorage.removeItem("clarix_recommendation");
      navigate(ROUTES.RECOMMENDATION);
    } else {
      navigate(ROUTES.INTAKE, {
        state: { fromHome: true },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleStartDecision();
    }
  };

  const handleResumeDecision = (decision) => {
    sessionStorage.setItem("clarix_situation", decision.situation);
    sessionStorage.setItem(
      "clarix_recommendation",
      JSON.stringify({
        recommendation: decision.recommendation,
        summary: decision.summary,
        reasons: decision.reasons,
        tradeoff: decision.tradeoff,
        assumptions: decision.assumptions,
      }),
    );
    navigate(ROUTES.RECOMMENDATION, {
      state: { fromHome: true },
    });
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col pb-[72px]">
      <div className="h-12" />

      <div className="flex-1 px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 bg-brand-purple rounded-xl
                            flex items-center justify-center flex-shrink-0"
            >
              <span className="text-[14px] font-bold text-white uppercase">
                {firstName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-caption text-ink-30">{greeting}</p>
              <p className="text-[15px] font-bold text-ink-100 capitalize">
                {firstName}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(ROUTES.ACCOUNT)}
            className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                       rounded-[10px] flex items-center justify-center"
            aria-label="Account"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="#1A1917"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </div>

        {/* Main prompt */}
        <h1
          className="text-[22px] font-extrabold text-ink-100
                       tracking-tight leading-snug mb-4"
        >
          What are you deciding today?
        </h1>

        {/* Quick input */}
        <div
          className={`bg-surface-0 rounded-xl border-[1.5px]
                         transition-all duration-150 mb-5
                         ${
                           inputText.length > 0
                             ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.08)]"
                             : "border-[rgba(26,25,23,0.1)]"
                         }`}
        >
          <div className="flex items-center px-4 gap-3 h-13">
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="#9C9A92"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your situation..."
              className="flex-1 bg-transparent text-[14px] text-ink-100
                         placeholder-ink-30 outline-none border-none
                         font-sans py-4"
            />
            <button
              onClick={handleStartDecision}
              className={`w-7 h-7 rounded-lg flex items-center justify-center
                          flex-shrink-0 transition-colors duration-150
                          ${
                            inputText.trim().length > 0
                              ? "bg-brand-purple"
                              : "bg-surface-2"
                          }`}
              aria-label="Start decision"
            >
              <svg
                width="12"
                height="12"
                fill="none"
                stroke={inputText.trim().length > 0 ? "white" : "#9C9A92"}
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

        {/* Recent decisions */}
        {loadingDecisions ? (
          <div className="flex flex-col gap-3">
            <div className="section-label">Recent decisions</div>
            {[1, 2].map((i) => (
              <div key={i} className="card">
                <div
                  className="h-3 w-20 bg-surface-2 rounded-xs
                                mb-3 animate-pulse"
                />
                <div
                  className="h-4 w-full bg-surface-2 rounded-xs
                                mb-2 animate-pulse"
                />
                <div
                  className="h-3 w-3/4 bg-surface-2 rounded-xs
                                animate-pulse"
                />
              </div>
            ))}
          </div>
        ) : decisions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Recent decisions</p>
              <button
                onClick={() => navigate(ROUTES.HISTORY)}
                className="text-caption text-brand-purple font-semibold"
              >
                See all
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {decisions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleResumeDecision(d)}
                  className={`card text-left border-l-[3px]
                              ${DECISION_TYPE_COLORS[d.decision_type] || "border-l-ink-30"}
                              hover:border-[rgba(26,25,23,0.14)]
                              transition-colors duration-150`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className="text-caption text-ink-30 uppercase
                                     tracking-[0.05em] font-bold"
                    >
                      {DECISION_TYPE_LABELS[d.decision_type] || "Decision"}
                    </span>
                    <span className="text-caption text-ink-30 flex-shrink-0">
                      {timeAgo(d.created_at)}
                    </span>
                  </div>
                  <p
                    className="text-[13px] font-semibold text-ink-100
                                leading-snug mb-1 line-clamp-2"
                  >
                    {d.situation}
                  </p>
                  <p
                    className="text-[12px] text-brand-teal font-medium
                                line-clamp-1"
                  >
                    {d.recommendation}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center
                          gap-4 py-12"
          >
            <div
              className="w-12 h-12 bg-brand-purple-light rounded-xl
                            flex items-center justify-center"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#534AB7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-ink-100 mb-1">
                No decisions yet
              </p>
              <p className="text-body-sm text-ink-50">
                Your saved decisions will appear here.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate(ROUTES.INTAKE)}
            >
              Make my first decision
            </button>
          </div>
        )}
      </div>

      <BottomNav active="decide" />
    </div>
  );
}
