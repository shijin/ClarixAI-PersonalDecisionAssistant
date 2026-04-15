import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../constants/routes";

export default function ShareScreen() {
  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const rec = sessionStorage.getItem("clarix_recommendation");
    if (!rec) {
      navigate(ROUTES.RECOMMENDATION);
      return;
    }
    try {
      setRecommendation(JSON.parse(rec));
    } catch {
      navigate(ROUTES.RECOMMENDATION);
    }
  }, []);

  const generateShareLink = async () => {
    setGenerating(true);
    try {
      const situation = sessionStorage.getItem("clarix_situation") || "";
      const rec = JSON.parse(
        sessionStorage.getItem("clarix_recommendation") || "{}",
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("decisions")
        .insert({
          user_id: user?.id || null,
          situation: situation,
          decision_type: "other",
          recommendation: rec.recommendation,
          summary: rec.summary,
          reasons: rec.reasons || [],
          tradeoff: rec.tradeoff || {},
          assumptions: rec.assumptions || [],
          status: "saved",
          is_public: true,
        })
        .select("share_id")
        .single();

      if (error) throw error;
      const url = window.location.origin + "/s/" + data.share_id;
      setShareUrl(url);
    } catch {
      setShareUrl(window.location.origin);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = shareUrl || window.location.origin;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const el = document.createElement("textarea");
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsApp = () => {
    if (!recommendation) return;

    // Keep WhatsApp message short to avoid truncation
    // wa.me URLs have a character limit so we send
    // one sentence recommendation plus the app link only
    const sentence = recommendation.recommendation || "";

    // Truncate to 100 characters if still too long
    const truncated =
      sentence.length > 100 ? sentence.slice(0, 97) + "..." : sentence;

    const appLink = "https://clarix-ai-personal-decision-assista.vercel.app";

    const text =
      "I used Clarix AI to help me decide: " +
      truncated +
      "\n\nGet your own recommendation: " +
      appLink;

    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  const handleEmail = () => {
    const subject = "A recommendation from Clarix";
    const body = recommendation
      ? "I used Clarix to help me make a decision.\n\n" +
        "Recommendation: " +
        recommendation.recommendation +
        "\n\n" +
        (recommendation.summary || "") +
        "\n\nGet your own recommendation at: " +
        "https://clarix-ai-personal-decision-assista.vercel.app"
      : "Check out Clarix: https://clarix-ai-personal-decision-assista.vercel.app";

    window.open(
      "mailto:?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body),
      "_blank",
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.RECOMMENDATION);
    }
  };

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
        <span className="text-body-sm font-semibold text-ink-30">Share</span>
        <div className="w-9" />
      </div>

      <h1
        className="text-[22px] font-extrabold text-ink-100
                     tracking-tight mb-2"
      >
        Share this recommendation
      </h1>
      <p className="text-body-sm text-ink-50 leading-relaxed mb-6">
        The recipient sees the recommendation and reasoning. Your personal
        context and income details are never shared.
      </p>

      {recommendation && (
        <div className="card mb-6">
          <p className="section-label mb-3">What they will see</p>
          <div
            className="bg-brand-teal-light border
                          border-[rgba(15,110,86,0.15)] rounded-xl
                          px-4 py-3 mb-3"
          >
            <p
              className="text-[13px] font-semibold text-ink-100
                          leading-snug"
            >
              {recommendation.recommendation}
            </p>
          </div>
          {recommendation.summary && (
            <p
              className="text-body-sm text-ink-50 leading-relaxed
                          line-clamp-2 mb-2"
            >
              {recommendation.summary}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-caption text-ink-30">
              Your income, age, and personal details are hidden
            </p>
          </div>
        </div>
      )}

      <p className="section-label mb-3">Share via</p>
      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={handleWhatsApp}
          className="flex items-center gap-4 px-4 py-3 bg-surface-0
                     border border-[rgba(26,25,23,0.08)] rounded-xl
                     text-left hover:border-[rgba(26,25,23,0.14)]
                     transition-colors duration-150"
        >
          <div
            className="w-9 h-9 bg-[rgba(37,211,102,0.1)] rounded-lg
                          flex items-center justify-center flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D166">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-ink-100">WhatsApp</p>
            <p className="text-caption text-ink-30">
              Send directly to a contact
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

        <button
          onClick={handleEmail}
          className="flex items-center gap-4 px-4 py-3 bg-surface-0
                     border border-[rgba(26,25,23,0.08)] rounded-xl
                     text-left hover:border-[rgba(26,25,23,0.14)]
                     transition-colors duration-150"
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
            <p className="text-[14px] font-semibold text-ink-100">Email</p>
            <p className="text-caption text-ink-30">Send via your email app</p>
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
      </div>

      <p className="section-label mb-3">Or copy a link</p>
      {!shareUrl ? (
        <button
          onClick={generateShareLink}
          disabled={generating}
          className="btn-secondary mb-3"
        >
          {generating ? (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 border-2 border-brand-purple
                              border-t-transparent rounded-full animate-spin"
              />
              <span>Generating link...</span>
            </div>
          ) : (
            "Generate share link"
          )}
        </button>
      ) : (
        <div
          className="flex items-center gap-3 bg-surface-0 border
                        border-[rgba(26,25,23,0.08)] rounded-xl
                        px-4 py-3 mb-3"
        >
          <p className="text-[12px] text-ink-50 font-mono flex-1 truncate">
            {shareUrl}
          </p>
          <button
            onClick={handleCopy}
            className={`text-[12px] font-bold flex-shrink-0
                        transition-colors duration-150
                        ${copied ? "text-brand-teal" : "text-brand-purple"}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      {copied && (
        <div
          className="flex items-center gap-2 px-4 py-3
                        bg-brand-teal-light border
                        border-[rgba(15,110,86,0.2)] rounded-xl mb-4"
        >
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
          <p className="text-body-sm text-brand-teal font-medium">
            Link copied to clipboard
          </p>
        </div>
      )}

      <button className="btn-ghost mt-auto" onClick={handleBack}>
        Back to recommendation
      </button>
    </div>
  );
}
