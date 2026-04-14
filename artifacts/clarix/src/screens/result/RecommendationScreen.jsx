import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendation } from "../../lib/claude";
import { ROUTES } from "../../constants/routes";

function IconBack() {
  return (
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
  );
}

function IconShare() {
  return (
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function IconSave() {
  return (
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
      <path
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1
               2-2h11l5 5v11a2 2 0 0 1-2 2z"
      />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function IconChat() {
  return (
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconWarning() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="#BA7517"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0
               1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="#9C9A92"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="12"
      height="12"
      fill="none"
      stroke="#0F6E56"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─────────────────────────────────────
// Quick suggestion helper
// Returns relevant correction options
// based on the assumption text
// ─────────────────────────────────────

function getQuickSuggestions(assumption) {
  const lower = assumption.toLowerCase();
  if (lower.includes("smok") || lower.includes("tobacco")) {
    return ["I am a smoker", "I use tobacco occasionally"];
  }
  if (lower.includes("insurance") || lower.includes("coverage")) {
    return ["I have employer insurance", "I have an existing policy"];
  }
  if (lower.includes("expense") || lower.includes("spending")) {
    return ["My expenses are higher", "My expenses are lower"];
  }
  if (
    lower.includes("invest") ||
    lower.includes("sip") ||
    lower.includes("maintain")
  ) {
    return ["I may need to pause investing", "My income is irregular"];
  }
  if (lower.includes("dependent") || lower.includes("family")) {
    return ["I have dependents", "My family situation is different"];
  }
  if (
    lower.includes("loan") ||
    lower.includes("debt") ||
    lower.includes("emi")
  ) {
    return ["I have an existing loan", "I have EMIs to pay"];
  }
  if (lower.includes("salary") || lower.includes("income")) {
    return ["My income is irregular", "I have other income sources"];
  }
  return ["This is incorrect", "My situation is different"];
}

// ─────────────────────────────────────
// Assumption row component
// Handles the inline correction flow
// for a single assumption
// ─────────────────────────────────────

function AssumptionRow({ assumption, index, onCorrect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [correction, setCorrection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isReady = correction.trim().length > 2;

  const handleSubmit = () => {
    if (!isReady) return;
    setSubmitted(true);
    setIsEditing(false);
    onCorrect(correction.trim());
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCorrection("");
  };

  return (
    <div
      className={`flex flex-col gap-2
                  ${
                    index > 0
                      ? "pt-3 border-t border-[rgba(26,25,23,0.06)]"
                      : ""
                  }`}
    >
      {/* Assumption text and action button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1">
          {/* Label changes based on state */}
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.05em]
                            ${submitted ? "text-brand-teal-mid" : "text-ink-30"}`}
          >
            {submitted ? "Corrected" : "Assumed"}
          </span>

          {/* Original assumption — struck through if corrected */}
          <p
            className={`text-body-sm leading-relaxed transition-all duration-200
                         ${
                           submitted
                             ? "line-through text-ink-30"
                             : "text-ink-80"
                         }`}
          >
            {assumption}
          </p>

          {/* Show the correction the user provided */}
          {submitted && (
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 bg-brand-teal-light rounded-full
                              flex items-center justify-center flex-shrink-0"
              >
                <IconCheck />
              </div>
              <p className="text-body-sm text-brand-teal font-medium">
                {correction}
              </p>
            </div>
          )}
        </div>

        {/* Correct / Cancel button */}
        {!submitted && (
          <button
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            className={`text-[12px] font-bold flex-shrink-0 mt-1
                        transition-colors duration-150
                        ${isEditing ? "text-ink-30" : "text-brand-purple"}`}
          >
            {isEditing ? "Cancel" : "Correct"}
          </button>
        )}
      </div>

      {/* Inline correction input — shown when editing */}
      {isEditing && !submitted && (
        <div className="flex flex-col gap-2 pt-1">
          {/* Text input area */}
          <div
            className={`bg-surface-1 rounded-xl p-3 border-[1.5px]
                           transition-all duration-150
                           ${
                             correction.length > 0
                               ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.08)]"
                               : "border-[rgba(26,25,23,0.1)]"
                           }`}
          >
            <p
              className="text-[10px] font-bold text-ink-30 uppercase
                          tracking-[0.05em] mb-2"
            >
              What should we know instead?
            </p>
            <textarea
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder="e.g. My actual monthly expenses are Rs 22,000..."
              rows={2}
              autoFocus
              className="w-full bg-transparent text-[13px] text-ink-100
                         placeholder-ink-30 leading-relaxed resize-none
                         outline-none border-none font-sans"
            />
          </div>

          {/* Quick suggestion pills */}
          <div className="flex gap-2 flex-wrap">
            {getQuickSuggestions(assumption).map((s, si) => (
              <button
                key={si}
                onClick={() => setCorrection(s)}
                className={`h-7 px-3 rounded-pill text-[11px] font-semibold
                            border transition-all duration-150
                            ${
                              correction === s
                                ? "bg-brand-purple text-white border-brand-purple"
                                : "bg-surface-0 text-ink-50 border-[rgba(26,25,23,0.1)]"
                            }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Update button */}
          <button
            onClick={handleSubmit}
            disabled={!isReady}
            className={`h-9 rounded-lg text-[13px] font-bold
                        transition-colors duration-150
                        ${
                          isReady
                            ? "bg-brand-purple text-white cursor-pointer"
                            : "bg-surface-3 text-ink-30 cursor-not-allowed"
                        }`}
          >
            Update recommendation
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// Loading state
// ─────────────────────────────────────

function LoadingState({ situation, isUpdating }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      <div className="flex items-center justify-between mb-9">
        <div
          className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                        rounded-[10px] flex items-center justify-center opacity-40"
        >
          <IconBack />
        </div>
        <span className="text-body-sm font-semibold text-ink-30">
          {isUpdating
            ? "Updating recommendation" + dots
            : "Working on it" + dots}
        </span>
        <div className="w-9" />
      </div>

      {/* Situation recap card */}
      <div className="card mb-8">
        <p className="section-label mb-2">Your situation</p>
        <p className="text-body-sm text-ink-80 leading-relaxed line-clamp-3">
          {situation}
        </p>
      </div>

      {/* Skeleton blocks */}
      <div className="mb-4">
        <div className="h-4 w-24 bg-surface-2 rounded-xs mb-4 animate-pulse" />
        <div className="h-8 w-full bg-surface-2 rounded-xs mb-2 animate-pulse" />
        <div className="h-8 w-4/5 bg-surface-2 rounded-xs mb-2 animate-pulse" />
        <div className="h-8 w-3/5 bg-surface-2 rounded-xs animate-pulse" />
      </div>

      <div className="h-px bg-[rgba(26,25,23,0.06)] my-6" />

      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="h-3 w-32 bg-surface-2 rounded-xs mb-3 animate-pulse" />
            <div className="h-3 w-full bg-surface-2 rounded-xs mb-2 animate-pulse" />
            <div className="h-3 w-4/5 bg-surface-2 rounded-xs animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8 flex items-center justify-center gap-3">
        <div
          className="w-4 h-4 border-2 border-surface-3 border-t-brand-purple
                        rounded-full animate-spin"
        />
        <span className="text-caption text-ink-30">
          {isUpdating
            ? "Recalculating based on your correction..."
            : "Analysing your situation — usually under 10 seconds"}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Error state
// ─────────────────────────────────────

function ErrorState({ onRetry, onBack }) {
  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      <div className="flex items-center justify-between mb-9">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                     rounded-[10px] flex items-center justify-center"
        >
          <IconBack />
        </button>
        <span className="text-body-sm font-semibold text-ink-30">
          Something went wrong
        </span>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className="w-14 h-14 bg-semantic-error-bg border
                        border-[rgba(163,45,45,0.2)] rounded-xl
                        flex items-center justify-center"
        >
          <svg
            width="24"
            height="24"
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

        <div className="text-center">
          <h2 className="text-h2 text-ink-100 mb-2">
            Could not get your recommendation
          </h2>
          <p className="text-body-sm text-ink-50 leading-relaxed">
            Your situation has been saved. Tap try again and we will pick up
            where we left off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <svg
            width="13"
            height="13"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-caption text-brand-teal-mid font-semibold">
            Your context was saved
          </span>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <button className="btn-primary" onClick={onRetry}>
            Try again
          </button>
          <button className="btn-ghost" onClick={onBack}>
            Edit my situation
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Follow-up needed state
// Claude needs one more answer before
// it can produce a recommendation
// ─────────────────────────────────────

function FollowUpNeeded({ question, situation, onAnswer, onBack }) {
  const [answer, setAnswer] = useState("");
  const isReady = answer.trim().length > 2;

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      <div className="flex items-center justify-between mb-9">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-surface-0 border border-[rgba(26,25,23,0.1)]
                     rounded-[10px] flex items-center justify-center"
        >
          <IconBack />
        </button>
        <span className="text-body-sm font-semibold text-ink-30">
          One quick question
        </span>
        <div className="w-9" />
      </div>

      {/* Situation recap */}
      <div className="card mb-6">
        <p className="section-label mb-2">Your situation</p>
        <p className="text-body-sm text-ink-80 leading-relaxed line-clamp-2">
          {situation}
        </p>
      </div>

      {/* Follow-up question */}
      <div
        className="bg-brand-purple-light border border-[rgba(83,74,183,0.2)]
                      rounded-2xl p-4 mb-6"
      >
        <div
          className="inline-flex items-center h-5 px-2 bg-brand-purple
                        rounded-pill mb-3"
        >
          <span
            className="text-[9px] font-bold text-white uppercase
                           tracking-[0.06em]"
          >
            Follow-up
          </span>
        </div>
        <p className="text-[15px] font-semibold text-ink-100 leading-snug">
          {question}
        </p>
        <p className="text-caption text-ink-50 mt-2">
          This helps us give you a more accurate recommendation.
        </p>
      </div>

      {/* Answer input */}
      <div
        className={`bg-surface-0 rounded-2xl p-4 mb-4 border-[1.5px]
                       transition-all duration-150
                       ${
                         answer.length > 0
                           ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.1)]"
                           : "border-[rgba(26,25,23,0.12)]"
                       }`}
      >
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={3}
          autoFocus
          className="w-full bg-transparent text-[15px] text-ink-100
                     placeholder-ink-30 leading-relaxed resize-none
                     outline-none border-none font-sans"
        />
      </div>

      {/* Quick answer pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {["Yes", "No", "Not sure"].map((opt) => (
          <button
            key={opt}
            onClick={() => setAnswer(opt)}
            className={`h-8 px-4 rounded-pill text-[12px] font-semibold
                        border transition-all duration-150
                        ${
                          answer === opt
                            ? "bg-brand-purple text-white border-brand-purple"
                            : "bg-surface-0 text-ink-50 border-[rgba(26,25,23,0.1)]"
                        }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <button
          className="btn-primary"
          disabled={!isReady}
          onClick={() => onAnswer(answer)}
        >
          Get my recommendation
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Update banner
// Shows briefly after a correction
// is applied and recommendation updates
// ─────────────────────────────────────

function UpdateBanner({ visible }) {
  if (!visible) return null;

  return (
    <div
      className="mx-5 mb-4 flex items-center gap-3 px-4 py-3
                    bg-brand-teal-light border border-[rgba(15,110,86,0.2)]
                    rounded-xl"
    >
      <div
        className="w-5 h-5 bg-brand-teal-mid rounded-full
                      flex items-center justify-center flex-shrink-0"
      >
        <IconCheck />
      </div>
      <p className="text-body-sm text-brand-teal font-medium">
        Recommendation updated based on your correction
      </p>
    </div>
  );
}

// ─────────────────────────────────────
// Main recommendation result screen
// ─────────────────────────────────────

function RecommendationResult({
  data,
  situation,
  onFollowUp,
  onSave,
  onShare,
  onCorrectAssumption,
  wasUpdated,
}) {
  const scrollRef = useRef(null);

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col">
      <div className="h-12 bg-surface-0" />

      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-5 h-14
                      bg-surface-0 border-b border-[rgba(26,25,23,0.07)]"
      >
        <button
          onClick={onFollowUp}
          className="w-9 h-9 bg-surface-1 border border-[rgba(26,25,23,0.1)]
                     rounded-[10px] flex items-center justify-center"
          aria-label="Go back"
        >
          <IconBack />
        </button>
        <span className="text-body-sm font-semibold text-ink-30">
          Your recommendation
        </span>
        <div className="flex gap-2">
          <button
            onClick={onShare}
            className="w-9 h-9 bg-surface-1 border border-[rgba(26,25,23,0.1)]
                       rounded-[10px] flex items-center justify-center"
            aria-label="Share"
          >
            <IconShare />
          </button>
          <button
            onClick={onSave}
            className="w-9 h-9 bg-surface-1 border border-[rgba(26,25,23,0.1)]
                       rounded-[10px] flex items-center justify-center"
            aria-label="Save"
          >
            <IconSave />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-32">
        {/* Update banner — shown after assumption correction */}
        <UpdateBanner visible={wasUpdated} />

        {/* ── Answer zone — white, above the fold ── */}
        <div
          className="bg-surface-0 px-5 pt-7 pb-8
                        border-b border-[rgba(26,25,23,0.07)]"
        >
          {/* Context tag */}
          <div
            className="inline-flex items-center gap-[6px] bg-surface-1
                          border border-[rgba(26,25,23,0.08)] rounded-pill
                          px-3 py-[5px] mb-5"
          >
            <div className="w-[5px] h-[5px] rounded-full bg-brand-teal-mid" />
            <span className="text-caption text-ink-50">
              Based on your situation
            </span>
          </div>

          {/* Section label */}
          <p className="section-label mb-3">Your recommendation</p>

          {/* The recommendation — large and confident */}
          <h1
            className="text-[24px] font-extrabold text-ink-100
                         leading-snug tracking-tight mb-5"
          >
            {data.recommendation}
          </h1>

          {/* Summary */}
          <p className="text-body-lg text-ink-50 leading-relaxed mb-6">
            {data.summary}
          </p>

          {/* Scroll hint */}
          <div className="flex items-center gap-2">
            <IconChevronDown />
            <span className="text-caption text-ink-30">
              Scroll to see the full reasoning
            </span>
          </div>
        </div>

        {/* ── Reasoning zone ── */}
        <div className="px-5 pt-6 flex flex-col gap-5">
          {/* Why this works for you */}
          {data.reasons && data.reasons.length > 0 && (
            <div>
              <p className="section-label mb-3">Why this works for you</p>
              <div className="flex flex-col gap-3">
                {data.reasons.map((reason, i) => (
                  <div key={i} className="card">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-[6px] h-[6px] rounded-full
                                      bg-brand-purple flex-shrink-0"
                      />
                      <p className="text-[14px] font-bold text-ink-100">
                        {reason.title}
                      </p>
                    </div>
                    <p className="text-body-sm text-ink-50 leading-relaxed">
                      {reason.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade-off */}
          {data.tradeoff && data.tradeoff.title && (
            <div>
              <p className="section-label mb-3">The trade-off to know</p>
              <div
                className="bg-semantic-warning-bg border
                              border-[rgba(186,117,23,0.2)] rounded-xl
                              p-4 flex gap-3"
              >
                <div
                  className="w-8 h-8 bg-[rgba(186,117,23,0.15)] rounded-lg
                                flex items-center justify-center flex-shrink-0
                                mt-[2px]"
                >
                  <IconWarning />
                </div>
                <div>
                  <p
                    className="text-[13px] font-bold
                                text-semantic-warning-dark mb-1"
                  >
                    {data.tradeoff.title}
                  </p>
                  <p
                    className="text-body-sm text-semantic-warning
                                leading-relaxed"
                  >
                    {data.tradeoff.body}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Assumptions — with inline correction flow */}
          {data.assumptions && data.assumptions.length > 0 && (
            <div>
              <p className="section-label mb-3">Assumptions we made</p>
              <div className="card flex flex-col gap-3">
                {data.assumptions.map((assumption, i) => (
                  <AssumptionRow
                    key={i}
                    assumption={assumption}
                    index={i}
                    onCorrect={(correctedValue) =>
                      onCorrectAssumption(assumption, correctedValue)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Original situation recap */}
          <div>
            <p className="section-label mb-3">Your situation</p>
            <div className="card">
              <p className="text-body-sm text-ink-50 leading-relaxed">
                {situation}
              </p>
            </div>
          </div>

          <div className="h-4" />
        </div>
      </div>

      {/* ── Sticky action bar ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
                      max-w-[480px] px-5 py-4 bg-surface-1
                      border-t border-[rgba(26,25,23,0.07)]"
      >
        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={onFollowUp}>
            <IconChat />
            Ask a follow-up
          </button>
          <button
            onClick={onShare}
            className="w-[52px] h-12 bg-surface-0 border
                       border-[rgba(26,25,23,0.1)] rounded-xl
                       flex items-center justify-center flex-shrink-0"
            aria-label="Share"
          >
            <IconShare />
          </button>
          <button
            onClick={onSave}
            className="w-[52px] h-12 bg-surface-0 border
                       border-[rgba(26,25,23,0.1)] rounded-xl
                       flex items-center justify-center flex-shrink-0"
            aria-label="Save"
          >
            <IconSave />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Root export
// Orchestrates all screen states
// ─────────────────────────────────────

export default function RecommendationScreen() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [situation, setSituation] = useState("");
  const [followUpQ, setFollowUpQ] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("clarix_situation");
    if (!stored) {
      navigate(ROUTES.INTAKE);
      return;
    }
    setSituation(stored);
    fetchRecommendation(stored, false);
  }, []);

  const fetchRecommendation = async (sit, updating = false) => {
    setStatus("loading");
    setIsUpdating(updating);
    setError(null);

    try {
      const result = await getRecommendation(sit);

      if (result.followUpNeeded && result.followUpQuestion) {
        setFollowUpQ(result.followUpQuestion);
        setStatus("followup");
        return;
      }

      setData(result);
      setStatus("success");

      if (updating) {
        setWasUpdated(true);
        // Hide the update banner after 4 seconds
        setTimeout(() => setWasUpdated(false), 4000);
      }

      sessionStorage.setItem("clarix_recommendation", JSON.stringify(result));
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleFollowUpAnswer = async (answer) => {
    const enriched =
      situation +
      "\n\nAdditional context: " +
      followUpQ +
      "\nAnswer: " +
      answer;
    setSituation(enriched);
    sessionStorage.setItem("clarix_situation", enriched);
    setFollowUpQ(null);
    await fetchRecommendation(enriched, false);
  };

  const handleCorrectAssumption = async (originalAssumption, correction) => {
    const enriched =
      situation +
      '\n\nCorrection to an assumption: We assumed "' +
      originalAssumption +
      '" but the user has corrected this: "' +
      correction +
      '". Please update your recommendation to reflect this correction.';
    setSituation(enriched);
    sessionStorage.setItem("clarix_situation", enriched);
    await fetchRecommendation(enriched, true);
  };

  const handleRetry = () => fetchRecommendation(situation, false);
  const handleBack = () => navigate(ROUTES.INTAKE);
  const handleFollowUp = () => navigate(ROUTES.CONVERSATION);
  const handleSave = () => navigate(ROUTES.SAVE);
  const handleShare = () => navigate(ROUTES.SHARE);

  if (status === "loading") {
    return <LoadingState situation={situation} isUpdating={isUpdating} />;
  }

  if (status === "error") {
    return <ErrorState onRetry={handleRetry} onBack={handleBack} />;
  }

  if (status === "followup") {
    return (
      <FollowUpNeeded
        question={followUpQ}
        situation={situation}
        onAnswer={handleFollowUpAnswer}
        onBack={handleBack}
      />
    );
  }

  if (status === "success" && data) {
    return (
      <RecommendationResult
        data={data}
        situation={situation}
        onFollowUp={handleFollowUp}
        onSave={handleSave}
        onShare={handleShare}
        onCorrectAssumption={handleCorrectAssumption}
        wasUpdated={wasUpdated}
      />
    );
  }

  return null;
}
