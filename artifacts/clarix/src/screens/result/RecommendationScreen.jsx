import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
      width="14"
      height="14"
      fill="none"
      stroke="#534AB7"
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

function IconSparkle() {
  return (
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
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function countPersonalisedFactors(situation) {
  const lower = situation.toLowerCase();
  let count = 0;
  if (
    lower.includes("rs ") ||
    lower.includes("rupee") ||
    lower.includes("lakh") ||
    lower.includes("salary") ||
    lower.includes("earn") ||
    lower.includes("income")
  )
    count++;
  if (lower.includes("year") || lower.includes("age") || lower.includes(" old"))
    count++;
  if (
    lower.includes("pune") ||
    lower.includes("mumbai") ||
    lower.includes("delhi") ||
    lower.includes("bengaluru") ||
    lower.includes("hyderabad") ||
    lower.includes("chennai") ||
    lower.includes("kolkata") ||
    lower.includes("city")
  )
    count++;
  if (
    lower.includes("dependent") ||
    lower.includes("family") ||
    lower.includes("wife") ||
    lower.includes("husband") ||
    lower.includes("child") ||
    lower.includes("parent")
  )
    count++;
  if (
    lower.includes("loan") ||
    lower.includes("emi") ||
    lower.includes("debt") ||
    lower.includes("saving") ||
    lower.includes("invest")
  )
    count++;
  return Math.max(count, 2);
}

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

function AssumptionRow({ assumption, index, onPendingCorrection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [correction, setCorrection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isReady = correction.trim().length > 2;

  const handlePending = () => {
    if (!isReady) return;
    setSubmitted(true);
    setIsEditing(false);
    onPendingCorrection(assumption, correction.trim());
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.05em]
                            ${
                              submitted ? "text-brand-teal-mid" : "text-ink-30"
                            }`}
          >
            {submitted ? "Correction pending" : "Assumed"}
          </span>
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
          {submitted && (
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 bg-brand-teal-light rounded-full
                              flex items-center justify-center flex-shrink-0"
              >
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
              </div>
              <p className="text-body-sm text-brand-teal font-medium">
                {correction}
              </p>
            </div>
          )}
        </div>
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

      {isEditing && !submitted && (
        <div className="flex flex-col gap-2 pt-1">
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
          <button
            onClick={handlePending}
            disabled={!isReady}
            className={`h-9 rounded-lg text-[13px] font-bold
                        transition-colors duration-150
                        ${
                          isReady
                            ? "bg-brand-purple text-white cursor-pointer"
                            : "bg-surface-3 text-ink-30 cursor-not-allowed"
                        }`}
          >
            Add correction
          </button>
        </div>
      )}
    </div>
  );
}

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

      <div className="card mb-8">
        <p className="section-label mb-2">Your situation</p>
        <p className="text-body-sm text-ink-80 leading-relaxed line-clamp-3">
          {situation}
        </p>
      </div>

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
            <div
              className="h-3 w-32 bg-surface-2 rounded-xs
                            mb-3 animate-pulse"
            />
            <div
              className="h-3 w-full bg-surface-2 rounded-xs
                            mb-2 animate-pulse"
            />
            <div className="h-3 w-4/5 bg-surface-2 rounded-xs animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8 flex items-center justify-center gap-3">
        <div
          className="w-4 h-4 border-2 border-surface-3
                        border-t-brand-purple rounded-full animate-spin"
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

      <div className="card mb-6">
        <p className="section-label mb-2">Your situation</p>
        <p className="text-body-sm text-ink-80 leading-relaxed line-clamp-2">
          {situation}
        </p>
      </div>

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

function PersonalisationChip({ situation }) {
  const count = countPersonalisedFactors(situation);
  return (
    <div
      className="inline-flex items-center gap-[6px] bg-brand-purple-light
                    border border-[rgba(83,74,183,0.2)] rounded-pill
                    px-3 py-[5px] mb-4"
    >
      <IconSparkle />
      <span className="text-[11px] font-semibold text-brand-purple-dark">
        Built around {count} details specific to your situation
      </span>
    </div>
  );
}
// ─────────────────────────────────────
// Platform integrations data
// Maps decision type to relevant
// action platforms with deep links
// ─────────────────────────────────────

const PLATFORM_MAP = {
  insurance: [
    {
      name: "PolicyBazaar",
      tagline: "Compare and buy term insurance plans",
      url: "https://www.policybazaar.com/life-insurance/term-insurance/",
      color: "#0066CC",
      letter: "P",
    },
    {
      name: "Ditto Insurance",
      tagline: "Get unbiased advice from insurance experts",
      url: "https://joinditto.in",
      color: "#E84141",
      letter: "D",
    },
  ],
  investment: [
    {
      name: "Groww",
      tagline: "Start your SIP in mutual funds",
      url: "https://groww.in/mutual-funds",
      color: "#00D09C",
      letter: "G",
    },
    {
      name: "Zerodha Coin",
      tagline: "Direct mutual funds at zero commission",
      url: "https://coin.zerodha.com",
      color: "#387ED1",
      letter: "Z",
    },
  ],
  career: [
    {
      name: "LinkedIn",
      tagline: "Research the company and role",
      url: "https://www.linkedin.com/jobs/",
      color: "#0A66C2",
      letter: "in",
    },
    {
      name: "Naukri",
      tagline: "Compare similar job offers",
      url: "https://www.naukri.com",
      color: "#FF7555",
      letter: "N",
    },
  ],
  housing: [
    {
      name: "MagicBricks",
      tagline: "Browse properties in your city",
      url: "https://www.magicbricks.com",
      color: "#E2001A",
      letter: "M",
    },
    {
      name: "NoBroker",
      tagline: "Find flats without brokerage",
      url: "https://www.nobroker.in",
      color: "#00A651",
      letter: "N",
    },
  ],
  purchase: [
    {
      name: "Amazon India",
      tagline: "Compare prices and reviews",
      url: "https://www.amazon.in",
      color: "#FF9900",
      letter: "A",
    },
    {
      name: "Flipkart",
      tagline: "Find the best deals",
      url: "https://www.flipkart.com",
      color: "#2874F0",
      letter: "F",
    },
  ],
};

function detectPlatformType(situation) {
  const lower = situation.toLowerCase();

  // Score each category by keyword matches
  const scores = {
    insurance: 0,
    investment: 0,
    career: 0,
    housing: 0,
    purchase: 0,
  };

  // Insurance keywords
  if (lower.includes("term insurance")) scores.insurance += 3;
  if (lower.includes("term plan")) scores.insurance += 3;
  if (lower.includes("life insurance")) scores.insurance += 3;
  if (lower.includes("health insurance")) scores.insurance += 3;
  if (lower.includes("buy insurance")) scores.insurance += 2;
  if (lower.includes("which insurance")) scores.insurance += 2;
  if (lower.includes("cover i need")) scores.insurance += 2;
  if (lower.includes("policybazaar")) scores.insurance += 2;

  // Investment keywords
  if (lower.includes("invest")) scores.investment += 2;
  if (lower.includes("sip")) scores.investment += 3;
  if (lower.includes("mutual fund")) scores.investment += 3;
  if (lower.includes("stock market")) scores.investment += 3;
  if (lower.includes("fixed deposit")) scores.investment += 2;
  if (lower.includes("build wealth")) scores.investment += 2;
  if (lower.includes("start investing")) scores.investment += 3;
  if (lower.includes("where to invest")) scores.investment += 3;
  if (lower.includes("portfolio")) scores.investment += 2;

  // Career keywords
  if (lower.includes("job offer")) scores.career += 3;
  if (lower.includes("new job")) scores.career += 3;
  if (lower.includes("should i take")) scores.career += 2;
  if (lower.includes("esop")) scores.career += 3;
  if (lower.includes("switch")) scores.career += 2;
  if (lower.includes("resign")) scores.career += 2;
  if (lower.includes("career")) scores.career += 2;
  if (lower.includes("salary hike")) scores.career += 2;
  if (lower.includes("promotion")) scores.career += 2;

  // Housing keywords
  if (lower.includes("rent or buy")) scores.housing += 3;
  if (lower.includes("home loan")) scores.housing += 3;
  if (lower.includes("buy a house")) scores.housing += 3;
  if (lower.includes("buy a flat")) scores.housing += 3;
  if (lower.includes("property")) scores.housing += 2;
  if (lower.includes("real estate")) scores.housing += 2;
  if (lower.includes("nobroker")) scores.housing += 3;
  if (lower.includes("magicbricks")) scores.housing += 3;

  // Purchase keywords
  if (lower.includes("buy a laptop")) scores.purchase += 3;
  if (lower.includes("buy a phone")) scores.purchase += 3;
  if (lower.includes("which laptop")) scores.purchase += 3;
  if (lower.includes("which phone")) scores.purchase += 3;
  if (lower.includes("best laptop")) scores.purchase += 2;
  if (lower.includes("best phone")) scores.purchase += 2;

  // Find the category with the highest score
  const topCategory = Object.entries(scores).reduce(
    (best, [category, score]) =>
      score > best.score ? { category, score } : best,
    { category: null, score: 0 },
  );

  // Only return a category if it has a meaningful score
  if (topCategory.score < 2) return null;

  return topCategory.category;
}

function PlatformSection({ situation }) {
  const type = detectPlatformType(situation);
  const platforms = PLATFORM_MAP[type];

  if (!platforms) return null;

  return (
    <div>
      <p className="section-label mb-3">Take action</p>
      <div className="flex flex-col gap-3">
        {platforms.map((p, i) => (
          <button
            key={i}
            onClick={() => window.open(p.url, "_blank")}
            className="flex items-center gap-4 px-4 py-3 bg-surface-0
                       border border-[rgba(26,25,23,0.08)] rounded-xl
                       text-left hover:border-[rgba(26,25,23,0.14)]
                       transition-colors duration-150 w-full"
          >
            {/* Platform icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center
                         justify-center flex-shrink-0"
              style={{ backgroundColor: p.color + "20" }}
            >
              <span
                className="text-[12px] font-bold"
                style={{ color: p.color }}
              >
                {p.letter}
              </span>
            </div>

            {/* Platform info */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-ink-100">{p.name}</p>
              <p className="text-caption text-ink-30 truncate">{p.tagline}</p>
            </div>

            {/* Arrow */}
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="#9C9A92"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-caption text-ink-30 mt-3 leading-relaxed">
        These are suggestions based on your decision type. Clarix earns no
        commission from any platform.
      </p>
    </div>
  );
}

// ─────────────────────────────────────
// Suggested follow-up questions
// Changes based on decision type
// ─────────────────────────────────────

function getSuggestedQuestions(situation) {
  const lower = situation.toLowerCase();

  if (
    lower.includes("term insurance") ||
    lower.includes("term plan") ||
    lower.includes("life insurance") ||
    lower.includes("cover i need")
  ) {
    return [
      "What happens if I miss a premium payment?",
      "Should I add any riders to my policy?",
      "How do I compare two insurance plans?",
      "What is the claims settlement ratio and why does it matter?",
    ];
  }

  if (
    lower.includes("invest") ||
    lower.includes("sip") ||
    lower.includes("mutual fund") ||
    lower.includes("build wealth")
  ) {
    return [
      "Which specific fund should I start with?",
      "What if the market crashes after I invest?",
      "Should I increase my SIP amount every year?",
      "How do I track if my investment is performing well?",
    ];
  }

  if (
    lower.includes("job offer") ||
    lower.includes("esop") ||
    lower.includes("career") ||
    lower.includes("switch")
  ) {
    return [
      "How do I evaluate the ESOP offer?",
      "What should I negotiate before accepting?",
      "How do I resign professionally from my current job?",
      "What if the startup fails in 2 years?",
    ];
  }

  if (
    lower.includes("rent") ||
    lower.includes("home loan") ||
    lower.includes("house") ||
    lower.includes("property")
  ) {
    return [
      "How much home loan can I afford?",
      "What are the hidden costs of buying a home?",
      "Should I take a fixed or floating interest rate?",
      "How long should I stay in the house to make it worth buying?",
    ];
  }

  return [
    "What are the risks I should know about?",
    "What if my situation changes in 6 months?",
    "How do I explain this decision to my family?",
    "What should I do first to act on this?",
  ];
}

function SuggestedQuestions({ situation, onQuestionSelect }) {
  const questions = getSuggestedQuestions(situation);

  return (
    <div>
      <p className="section-label mb-3">Questions to explore</p>
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onQuestionSelect(q)}
            className="flex items-center justify-between gap-3
                       px-4 py-3 bg-surface-0 border
                       border-[rgba(26,25,23,0.08)] rounded-xl
                       text-left group hover:border-brand-purple
                       hover:bg-brand-purple-light
                       transition-all duration-150"
          >
            <span
              className="text-[13px] text-ink-80 font-medium
                             group-hover:text-brand-purple-dark
                             leading-snug transition-colors duration-150"
            >
              {q}
            </span>
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="#9C9A92"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="flex-shrink-0 group-hover:stroke-brand-purple
                         transition-colors duration-150"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1
                       2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecommendationResult({
  data,
  situation,
  onBack,
  onFollowUp,
  onSave,
  onShare,
  onCorrectAssumption,
  wasUpdated,
  onDefence,
  onQuestionSelect,
}) {
  const scrollRef = useRef(null);
  const reasoningRef = useRef(null);

  const [showSavePulse, setShowSavePulse] = useState(true);
  const [showSaveTooltip, setShowSaveTooltip] = useState(true);
  const [afterCorrection, setAfterCorrection] = useState(false);
  const [pendingCorrections, setPendingCorrections] = useState({});

  // Show the pulse and tooltip for 4 seconds after load
  // then fade them out so they do not become annoying
  useEffect(() => {
    const pulseTimer = setTimeout(() => setShowSavePulse(false), 15000);
    const tooltipTimer = setTimeout(() => setShowSaveTooltip(false), 20000);
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  // Also hide both as soon as the user taps save
  const handleSaveWithDismiss = () => {
    setShowSavePulse(false);
    setShowSaveTooltip(false);
    onSave();
  };

  const handleScrollToReasoning = () => {
    reasoningRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col">
      <div className="h-12 bg-surface-0" />

      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-5 h-14
                      bg-surface-0 border-b border-[rgba(26,25,23,0.07)]"
      >
        <button
          onClick={onBack}
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
            onClick={handleSaveWithDismiss}
            className={`w-[52px] h-12 bg-surface-0 border
                       rounded-xl flex items-center justify-center
                       flex-shrink-0 relative transition-all duration-150
                       ${
                         showSavePulse
                           ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.2)] animate-pulse"
                           : "border-[rgba(26,25,23,0.1)]"
                       }`}
            aria-label="Save"
          >
            <IconSave />
            {showSavePulse && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3
                               bg-brand-purple rounded-full
                               animate-ping"
              />
            )}
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-40">
        <UpdateBanner visible={wasUpdated} />

        {/* Answer zone */}
        <div
          className="bg-surface-0 px-5 pt-7 pb-8
                        border-b border-[rgba(26,25,23,0.07)]"
        >
          <div
            className="inline-flex items-center gap-[6px] bg-surface-1
                          border border-[rgba(26,25,23,0.08)] rounded-pill
                          px-3 py-[5px] mb-4"
          >
            <div className="w-[5px] h-[5px] rounded-full bg-brand-teal-mid" />
            <span className="text-caption text-ink-50">
              Based on your situation
            </span>
          </div>

          <div className="block mb-1">
            <PersonalisationChip situation={situation} />
          </div>

          <p className="section-label mb-3">Your recommendation</p>

          <h1
            className="text-[24px] font-extrabold text-ink-100
                         leading-snug tracking-tight mb-4"
          >
            {data.recommendation}
          </h1>

          <p className="text-body-lg text-ink-50 leading-relaxed mb-5">
            {data.summary}
          </p>

          <button
            onClick={handleScrollToReasoning}
            className="flex items-center gap-2 group"
          >
            <span
              className="text-[13px] font-semibold text-brand-purple
                             group-hover:text-brand-purple-dark
                             transition-colors duration-150
                             underline underline-offset-2
                             decoration-[rgba(83,74,183,0.3)]"
            >
              Why we picked this for you
            </span>
            <IconChevronDown />
          </button>
        </div>

        {/* Reasoning zone */}
        <div ref={reasoningRef} className="px-5 pt-6 flex flex-col gap-5">
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

          {data.assumptions && data.assumptions.length > 0 && (
            <div>
              <p className="section-label mb-3">Assumptions we made</p>
              <div className="card flex flex-col gap-3">
                {data.assumptions.map((assumption, i) => (
                  <AssumptionRow
                    key={i}
                    assumption={assumption}
                    index={i}
                    onPendingCorrection={(original, correction) => {
                      setPendingCorrections((prev) => ({
                        ...prev,
                        [original]: correction,
                      }));
                    }}
                  />
                ))}
              </div>

              {/* Apply all corrections button */}
              {Object.keys(pendingCorrections).length > 0 && (
                <button
                  onClick={() => onCorrectAssumption(pendingCorrections)}
                  className="w-full mt-3 h-11 bg-brand-purple text-white
                             rounded-xl text-[13px] font-bold
                             flex items-center justify-center gap-2
                             transition-colors duration-150"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Apply {Object.keys(pendingCorrections).length} correction
                  {Object.keys(pendingCorrections).length > 1 ? "s" : ""} and
                  update
                </button>
              )}
            </div>
          )}

          {/* Suggested follow-up questions */}
          <SuggestedQuestions
            situation={situation}
            onQuestionSelect={onQuestionSelect}
          />

          {/* Platform integrations */}
          <PlatformSection situation={situation} />

          {/* Situation recap */}
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

      {/* Sticky action bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
                      max-w-[480px] px-5 py-4 bg-surface-1
                      border-t border-[rgba(26,25,23,0.07)]"
      >
        {/* ── Sticky action bar ── */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
                        max-w-[480px] px-5 py-4 bg-surface-1
                        border-t border-[rgba(26,25,23,0.07)]"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <button className="btn-primary flex-1" onClick={onFollowUp}>
                <IconChat />
                Ask a follow-up
              </button>
              <button
                onClick={onShare}
                className="w-[52px] h-12 bg-surface-0 border
                           border-[rgba(26,25,23,0.1)] rounded-xl
                           flex items-center justify-center flex-shrink-0
                           relative"
                aria-label="Share"
              >
                <IconShare />
              </button>
              <button
                onClick={onSave}
                className={`w-[52px] h-12 bg-surface-0 border
                           rounded-xl flex items-center justify-center
                           flex-shrink-0 relative transition-all duration-150
                           ${
                             showSavePulse
                               ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.2)] animate-pulse"
                               : "border-[rgba(26,25,23,0.1)]"
                           }`}
                aria-label="Save"
              >
                <IconSave />
                {showSavePulse && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3
                                   bg-brand-purple rounded-full
                                   animate-ping"
                  />
                )}
              </button>
            </div>

            {/* Save tooltip */}
            {showSaveTooltip && (
              <div
                className="flex items-center justify-center gap-2
                              px-4 py-2 bg-brand-purple-light border
                              border-[rgba(83,74,183,0.2)] rounded-xl"
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#534AB7"
                  strokeWidth="2"
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
                <span className="text-[12px] font-semibold text-brand-purple">
                  {afterCorrection
                    ? "Updated for you — save it before you leave"
                    : "Save this — you worked hard to get here"}
                </span>
              </div>
            )}

            <button onClick={onDefence} className="btn-ghost text-[13px]">
              Help me explain this to someone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Root export
// Key fix: checks sessionStorage for an
// existing recommendation before calling
// Claude. If one exists it loads instantly
// without making an API call.
// ─────────────────────────────────────

export default function RecommendationScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [situation, setSituation] = useState("");
  const [followUpQ, setFollowUpQ] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  useEffect(() => {
    const storedSituation = sessionStorage.getItem("clarix_situation");
    const storedRec = sessionStorage.getItem("clarix_recommendation");

    if (!storedSituation) {
      navigate(ROUTES.INTAKE);
      return;
    }

    setSituation(storedSituation);

    // ── KEY FIX ──
    // If a recommendation already exists in sessionStorage
    // load it instantly without calling Claude again.
    // This prevents unnecessary API calls when the user
    // navigates back from the conversation or intake screen.
    if (storedRec) {
      try {
        const parsed = JSON.parse(storedRec);
        setData(parsed);
        setStatus("success");
        return;
      } catch {
        // If parsing fails fall through to fetch a fresh one
      }
    }

    // No existing recommendation — fetch a fresh one
    fetchRecommendation(storedSituation, false);
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

  const handleCorrectAssumption = async (corrections) => {
    const correctionLines = Object.entries(corrections)
      .map(
        ([original, correction]) =>
          'We assumed "' +
          original +
          '" but the user corrected this to: "' +
          correction +
          '".',
      )
      .join("\n");

    const enriched =
      situation +
      "\n\nCorrections to assumptions:\n" +
      correctionLines +
      "\n\nPlease update your recommendation to reflect all these corrections.";

    setSituation(enriched);
    sessionStorage.setItem("clarix_situation", enriched);
    localStorage.setItem("clarix_situation", enriched);
    await fetchRecommendation(enriched, true);

    // Show save nudge again after assumption correction
    // This is the highest intent moment — user just refined their recommendation
    setAfterCorrection(true);
    setShowSavePulse(true);
    setShowSaveTooltip(true);
    setTimeout(() => setShowSavePulse(false), 15000);
    setTimeout(() => setShowSaveTooltip(false), 20000);
  };

  const handleRetry = () => fetchRecommendation(situation, false);
  const handleBack = () => {
    const backTo = sessionStorage.getItem("clarix_back_to");

    if (backTo === "home") {
      // Clear the flag so it does not persist incorrectly
      sessionStorage.removeItem("clarix_back_to");
      navigate(ROUTES.HOME);
    } else {
      navigate(ROUTES.INTAKE, {
        state: { fromRecommendation: true },
      });
    }
  };
  const handleFollowUp = () => navigate(ROUTES.CONVERSATION);
  const handleSave = () => {
    localStorage.setItem("clarix_situation", situation);
    localStorage.setItem("clarix_recommendation", JSON.stringify(data));
    navigate(ROUTES.SAVE);
  };
  const handleShare = () => navigate(ROUTES.SHARE);
  const handleDefence = () => navigate(ROUTES.DEFENCE);
  const handleQuestionSelect = (question) => {
    // Store the question so the conversation screen
    // can auto-send it without the user having to retype
    sessionStorage.setItem("clarix_prefilled_question", question);
    navigate(ROUTES.CONVERSATION);
  };

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
        onBack={handleBack}
        onFollowUp={handleFollowUp}
        onSave={handleSave}
        onShare={handleShare}
        onCorrectAssumption={handleCorrectAssumption}
        wasUpdated={wasUpdated}
        onDefence={handleDefence}
        onQuestionSelect={handleQuestionSelect}
      />
    );
  }

  return null;
}
