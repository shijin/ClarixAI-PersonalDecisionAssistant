import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendFollowUp } from "../../lib/claude";
import { ROUTES } from "../../constants/routes";

export default function DefenceScreen() {
  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState(null);
  const [objection, setObjection] = useState("");
  const [rebuttal, setRebuttal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const isReady = objection.trim().length > 5;

  useEffect(() => {
    const rec = sessionStorage.getItem("clarix_recommendation");
    const sit = sessionStorage.getItem("clarix_situation");

    if (!rec || !sit) {
      navigate(ROUTES.RECOMMENDATION);
      return;
    }

    try {
      setRecommendation(JSON.parse(rec));
    } catch {
      navigate(ROUTES.RECOMMENDATION);
    }
  }, []);

  // ── Generate the two-sentence defence summary ──
  const defenceSummary = recommendation
    ? buildDefenceSummary(recommendation)
    : "";

  const handleCheckObjection = async () => {
    if (!isReady || !recommendation) return;
    setLoading(true);
    setError(null);
    setRebuttal(null);

    try {
      const situation = sessionStorage.getItem("clarix_situation") || "";

      const messages = [
        {
          role: "user",
          content: situation,
        },
        {
          role: "assistant",
          content: JSON.stringify(recommendation),
        },
      ];

      const prompt =
        'Someone has raised this objection to my recommendation: "' +
        objection +
        '". Please evaluate this objection in 2 to 3 plain sentences. ' +
        "Either acknowledge it as valid and explain how it changes the recommendation, " +
        "or explain clearly why it does not change the recommendation. " +
        "Do not use jargon. Speak directly to the person raising the objection.";

      const result = await sendFollowUp(messages, prompt);

      if (result.type === "text") {
        setRebuttal(result.data);
      } else if (result.type === "structured") {
        setRebuttal(
          result.data?.summary ||
            result.data?.recommendation ||
            "The objection has been evaluated. Please review the updated recommendation.",
        );
      }
    } catch (err) {
      setError("Could not evaluate the objection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDefence = async () => {
    try {
      await navigator.clipboard.writeText(defenceSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const el = document.createElement("textarea");
      el.value = defenceSummary;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

      {/* Nav */}
      <div className="flex items-center justify-between mb-9">
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
        <span className="text-body-sm font-semibold text-ink-30">
          Explain this decision
        </span>
        <div className="w-9" />
      </div>

      {/* Heading */}
      <h1
        className="text-[22px] font-extrabold text-ink-100
                     tracking-tight mb-2"
      >
        Help me explain this
      </h1>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-7">
        A plain-language summary you can use to explain this recommendation to a
        family member or friend who pushes back.
      </p>

      {/* Defence summary card */}
      <div
        className="bg-brand-teal-light border
                      border-[rgba(15,110,86,0.2)] rounded-xl
                      px-4 py-4 mb-3"
      >
        <p className="section-label mb-3">Your two-sentence defence</p>
        <p className="text-[14px] text-ink-100 leading-relaxed font-medium">
          {defenceSummary}
        </p>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopyDefence}
        className={`flex items-center justify-center gap-2 h-10
                    rounded-xl border text-[13px] font-bold mb-7
                    transition-all duration-150
                    ${
                      copied
                        ? "bg-brand-teal-light border-[rgba(15,110,86,0.2)] text-brand-teal"
                        : "bg-surface-0 border-[rgba(26,25,23,0.1)] text-ink-80"
                    }`}
      >
        {copied ? (
          <>
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="#0F6E56"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied to clipboard
          </>
        ) : (
          <>
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="#1A1917"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy to clipboard
          </>
        )}
      </button>

      {/* Divider */}
      <div className="divider" />

      {/* Objection checker */}
      <p className="text-[15px] font-bold text-ink-100 mb-2">
        Check an objection
      </p>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-5">
        Paste in something someone said to push back on this recommendation.
        Clarix will evaluate it and tell you whether it changes anything.
      </p>

      {/* Objection input */}
      <div
        className={`bg-surface-0 rounded-xl p-4 mb-4
                       border-[1.5px] transition-all duration-150
                       ${
                         objection.length > 0
                           ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.08)]"
                           : "border-[rgba(26,25,23,0.12)]"
                       }`}
      >
        <p
          className="text-[10px] font-bold text-ink-30 uppercase
                      tracking-[0.05em] mb-2"
        >
          The objection
        </p>
        <textarea
          value={objection}
          onChange={(e) => setObjection(e.target.value)}
          placeholder={
            'e.g. "Why not get an LIC policy instead? ' +
            'Everyone trusts LIC."'
          }
          rows={3}
          className="w-full bg-transparent text-[14px] text-ink-100
                     placeholder-ink-30 leading-relaxed resize-none
                     outline-none border-none font-sans"
        />
      </div>

      {/* Common objection suggestions */}
      <div className="flex flex-col gap-2 mb-5">
        {[
          "Why not go with a more well-known brand?",
          "This seems too risky for me.",
          "I think I should wait before deciding.",
        ].map((s, i) => (
          <button
            key={i}
            onClick={() => setObjection(s)}
            className="flex items-center justify-between gap-3
                       px-4 py-3 bg-surface-0 border
                       border-[rgba(26,25,23,0.08)] rounded-xl
                       text-left group"
          >
            <span
              className="text-[13px] text-ink-80
                             group-hover:text-ink-100
                             transition-colors leading-snug"
            >
              {s}
            </span>
            <svg
              width="12"
              height="12"
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

      {/* Evaluate button */}
      <button
        onClick={handleCheckObjection}
        disabled={!isReady || loading}
        className="btn-primary mb-5"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 border-2 border-white
                            border-t-transparent rounded-full animate-spin"
            />
            <span>Evaluating objection...</span>
          </div>
        ) : (
          "Evaluate this objection"
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-2 px-4 py-3
                        bg-semantic-error-bg border
                        border-[rgba(163,45,45,0.2)] rounded-xl mb-4"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#A32D2D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            className="flex-shrink-0 mt-[2px]"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-body-sm text-semantic-error-dark">{error}</p>
        </div>
      )}

      {/* Rebuttal result */}
      {rebuttal && (
        <div
          className="bg-brand-purple-light border
                        border-[rgba(83,74,183,0.2)] rounded-xl
                        px-4 py-4 mb-4"
        >
          <p className="section-label mb-3">Clarix says</p>
          <p className="text-[14px] text-ink-100 leading-relaxed">{rebuttal}</p>
        </div>
      )}

      <button className="btn-ghost mt-2" onClick={() => navigate(-1)}>
        Back to recommendation
      </button>
    </div>
  );
}

// ─────────────────────────────────────
// Build a plain two-sentence defence
// from the recommendation data
// ─────────────────────────────────────

function buildDefenceSummary(rec) {
  if (!rec) return "";

  const firstReason = rec.reasons?.[0]?.body || "";
  const tradeoff = rec.tradeoff?.title || "";

  const sentence1 = rec.recommendation
    ? "I chose this option because " +
      (firstReason
        ? firstReason.charAt(0).toLowerCase() + firstReason.slice(1)
        : "it is the most suitable choice for my specific situation.")
    : "";

  const sentence2 = tradeoff
    ? "The main trade-off I am accepting is: " +
      tradeoff.charAt(0).toLowerCase() +
      tradeoff.slice(1) +
      ", which I have considered carefully."
    : "This recommendation was built specifically around my income, goals, and constraints — not generic advice.";

  return sentence1 + " " + sentence2;
}
