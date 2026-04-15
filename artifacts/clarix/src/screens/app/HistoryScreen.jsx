import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDecision } from "../../hooks/useDecision";
import { ROUTES } from "../../constants/routes";
import BottomNav from "../../components/layout/BottomNav";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "insurance", label: "Insurance" },
  { id: "investment", label: "Investment" },
  { id: "career", label: "Career" },
  { id: "purchase", label: "Purchase" },
  { id: "housing", label: "Housing" },
];

const TYPE_COLORS = {
  insurance: "border-l-brand-purple",
  investment: "border-l-brand-teal-mid",
  career: "border-l-[#BA7517]",
  purchase: "border-l-ink-30",
  housing: "border-l-[#185FA5]",
  other: "border-l-ink-30",
};

const TYPE_LABELS = {
  insurance: "Insurance",
  investment: "Investment",
  career: "Career",
  purchase: "Purchase",
  housing: "Housing",
  other: "Decision",
};

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryScreen() {
  const navigate = useNavigate();
  const { fetchDecisions, deleteDecision, loading } = useDecision();

  const [decisions, setDecisions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchText, setSearchText] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    const data = await fetchDecisions();
    setDecisions(data);
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
    navigate(ROUTES.RECOMMENDATION);
  };

  const handleDeleteConfirm = async (id) => {
    setDeletingId(id);
    const success = await deleteDecision(id);
    if (success) {
      setDecisions((prev) => prev.filter((d) => d.id !== id));
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  const filtered =
    activeFilter === "all"
      ? decisions
      : decisions.filter((d) => d.decision_type === activeFilter);

  // ── Empty state ──
  const EmptyState = () => (
    <div
      className="flex flex-col items-center justify-center
                    gap-4 py-16"
    >
      <div
        className="w-14 h-14 bg-brand-purple-light rounded-2xl
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
          <polyline points="12 20 12 10" />
          <polyline points="18 20 18 4" />
          <polyline points="6 20 6 16" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[15px] font-bold text-ink-100 mb-1">
          {activeFilter === "all"
            ? "No decisions saved yet"
            : `No ${TYPE_LABELS[activeFilter]?.toLowerCase()} decisions`}
        </p>
        <p className="text-body-sm text-ink-50 leading-relaxed">
          {activeFilter === "all"
            ? "Your saved decisions will appear here."
            : "Try a different filter or make a new decision."}
        </p>
      </div>
      {activeFilter === "all" && (
        <button className="btn-primary" onClick={() => navigate(ROUTES.INTAKE)}>
          Make my first decision
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col pb-[72px]">
      <div className="h-12" />

      <div className="flex-1 px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-[22px] font-extrabold text-ink-100
                         tracking-tight"
          >
            My decisions
          </h1>
          <button
            onClick={() => setSearchText((s) => !s)}
            className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                       rounded-[10px] flex items-center justify-center"
            aria-label="Search"
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Filter chips */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-4
                        scrollbar-none -mx-5 px-5"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`h-8 px-4 rounded-pill text-[12px] font-bold
                          whitespace-nowrap border flex-shrink-0
                          transition-all duration-150
                          ${
                            activeFilter === f.id
                              ? "bg-brand-purple text-white border-brand-purple"
                              : "bg-surface-0 text-ink-50 border-[rgba(26,25,23,0.1)]"
                          }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Decision count */}
        {!loading && decisions.length > 0 && (
          <p className="text-caption text-ink-30 mb-4">
            {filtered.length === decisions.length
              ? `${decisions.length} decision${decisions.length !== 1 ? "s" : ""} saved`
              : `${filtered.length} of ${decisions.length} decisions`}
          </p>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
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
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((decision) => (
              <div key={decision.id} className="relative">
                {/* Delete confirmation overlay */}
                {confirmDelete === decision.id ? (
                  <div
                    className="card border-semantic-error
                                  border-[rgba(163,45,45,0.3)]"
                  >
                    <p className="text-[14px] font-semibold text-ink-100 mb-1">
                      Delete this decision?
                    </p>
                    <p className="text-body-sm text-ink-50 mb-4">
                      This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteConfirm(decision.id)}
                        disabled={deletingId === decision.id}
                        className="flex-1 h-9 bg-semantic-error text-white
                                   rounded-lg text-[13px] font-bold
                                   flex items-center justify-center gap-2"
                      >
                        {deletingId === decision.id ? (
                          <div
                            className="w-3 h-3 border-2 border-white
                                          border-t-transparent rounded-full
                                          animate-spin"
                          />
                        ) : (
                          "Delete"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 h-9 bg-surface-2 text-ink-80
                                   rounded-lg text-[13px] font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Decision card */
                  <div
                    className={`card border-l-[3px] cursor-pointer
                                ${
                                  TYPE_COLORS[decision.decision_type] ||
                                  "border-l-ink-30"
                                }
                                hover:border-[rgba(26,25,23,0.14)]
                                transition-colors duration-150`}
                    onClick={() => handleResumeDecision(decision)}
                  >
                    <div
                      className="flex items-start
                                    justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        {/* Type and time */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-bold text-ink-30
                                           uppercase tracking-[0.05em]"
                          >
                            {TYPE_LABELS[decision.decision_type] || "Decision"}
                          </span>
                          <span className="text-caption text-ink-30">·</span>
                          <span className="text-caption text-ink-30">
                            {timeAgo(decision.created_at)}
                          </span>
                        </div>

                        {/* Situation */}
                        <p
                          className="text-[13px] font-semibold text-ink-100
                                      leading-snug mb-1 line-clamp-2"
                        >
                          {decision.situation}
                        </p>

                        {/* Recommendation preview */}
                        <p
                          className="text-[12px] text-brand-teal
                                      font-medium line-clamp-1"
                        >
                          {decision.recommendation}
                        </p>
                      </div>

                      {/* Actions */}
                      <div
                        className="flex flex-col items-end gap-2
                                      flex-shrink-0 ml-2"
                      >
                        <div
                          className="w-6 h-6 border border-[rgba(26,25,23,0.1)]
                                        rounded-[7px] flex items-center
                                        justify-center"
                        >
                          <svg
                            width="11"
                            height="11"
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(decision.id);
                          }}
                          className="text-caption text-ink-30
                                     hover:text-semantic-error
                                     transition-colors duration-150"
                          aria-label="Delete decision"
                        >
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="history" />
    </div>
  );
}
