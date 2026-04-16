import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDecision } from "../../hooks/useDecision";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../constants/routes";

// ─────────────────────────────────────
// Generate a random session ID for
// anonymous draft tracking
// ─────────────────────────────────────

function generateSessionId() {
  return "draft_" + Math.random().toString(36).slice(2) + Date.now();
}

export default function SavePromptScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { saving, saveDecision } = useDecision();

  const [situation, setSituation] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    // First try sessionStorage — covers the normal signed-in flow
    const sit = sessionStorage.getItem("clarix_situation");
    const rec = sessionStorage.getItem("clarix_recommendation");

    if (sit && rec) {
      setSituation(sit);
      try {
        setRecommendation(JSON.parse(rec));
        return;
      } catch {
        // Fall through to check draft
      }
    }

    // sessionStorage is empty — check if there is a pending draft
    // This covers the case where the user verified their email
    // and came back from a different browser session
    const draftId = localStorage.getItem("clarix_draft_id");
    if (draftId) {
      const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .eq("session_id", draftId)
        .single();

      if (!error && data) {
        setSituation(data.situation);
        setRecommendation(data.recommendation);

        // Restore to sessionStorage so the rest of the
        // app can use it normally
        sessionStorage.setItem("clarix_situation", data.situation);
        sessionStorage.setItem(
          "clarix_recommendation",
          JSON.stringify(data.recommendation),
        );
        return;
      }
    }

    // Nothing found — send back to intake
    navigate(ROUTES.INTAKE);
  };

  const handleSave = async () => {
    if (!recommendation) return;
    setError(null);

    // If user is not signed in — save a draft and redirect to sign in
    if (!user) {
      setSavingDraft(true);

      try {
        const sessionId = generateSessionId();

        const { error: draftError } = await supabase.from("drafts").insert({
          session_id: sessionId,
          situation: situation,
          recommendation: recommendation,
        });

        if (draftError) throw draftError;

        // Store the draft ID in localStorage so it survives
        // the email verification round trip
        localStorage.setItem("clarix_draft_id", sessionId);

        // Store where to return after sign in
        localStorage.setItem("clarix_return_to", ROUTES.SAVE);
      } catch (err) {
        // Draft failed — fall back to normal sign in flow
        // The user will lose their recommendation but can
        // describe their situation again
        console.error("Draft save failed:", err);
        localStorage.setItem("clarix_return_to", ROUTES.SAVE);
      } finally {
        setSavingDraft(false);
      }

      navigate(ROUTES.SIGN_IN);
      return;
    }

    // User is signed in — save the decision directly
    const result = await saveDecision(situation, recommendation);

    if (result) {
      setSaved(true);

      // Clean up draft if one exists
      const draftId = localStorage.getItem("clarix_draft_id");
      if (draftId) {
        await supabase.from("drafts").delete().eq("session_id", draftId);
        localStorage.removeItem("clarix_draft_id");
      }

      // Clear sessionStorage after successful save
      sessionStorage.removeItem("clarix_situation");
      sessionStorage.removeItem("clarix_recommendation");
      localStorage.removeItem("clarix_return_to");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  // ── Saved confirmation state ──
  if (saved) {
    return (
      <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
        <div className="h-12" />

        <div
          className="flex-1 flex flex-col items-center
                        justify-center gap-6"
        >
          <div
            className="w-16 h-16 bg-brand-teal-light border
                          border-[rgba(15,110,86,0.2)] rounded-2xl
                          flex items-center justify-center"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#0F6E56"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="text-center">
            <h1
              className="text-[26px] font-extrabold text-ink-100
                           tracking-tight mb-3"
            >
              Decision saved
            </h1>
            <p className="text-body-sm text-ink-50 leading-relaxed">
              You can return to this recommendation anytime from your decision
              history.
            </p>
          </div>

          <div className="card w-full">
            <p className="section-label mb-2">What was saved</p>
            <div className="flex flex-col gap-2">
              {[
                "Your recommendation and full reasoning",
                "Your situation and context",
                "All assumptions and trade-offs",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="#1D9E75"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-body-sm text-ink-80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              className="btn-primary"
              onClick={() => navigate(ROUTES.HISTORY)}
            >
              View my decisions
            </button>
            <button
              className="btn-ghost"
              onClick={() => navigate(ROUTES.INTAKE)}
            >
              Make another decision
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Default save prompt state ──
  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">
      <div className="h-12" />

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
          Save decision
        </span>
        <div className="w-9" />
      </div>

      {recommendation && (
        <div
          className="bg-brand-teal-light border
                        border-[rgba(15,110,86,0.15)] rounded-xl
                        p-4 mb-6"
        >
          <p className="section-label mb-2">Decision to save</p>
          <p
            className="text-[14px] font-semibold text-ink-100
                        leading-snug line-clamp-3"
          >
            {recommendation.recommendation}
          </p>
        </div>
      )}

      <h1
        className="text-[22px] font-extrabold text-ink-100
                     tracking-tight leading-snug mb-2"
      >
        Save and come back anytime
      </h1>

      {user ? (
        <p className="text-body-sm text-ink-50 leading-relaxed mb-6">
          Signed in as{" "}
          <span className="font-semibold text-ink-100">{user.email}</span>
        </p>
      ) : (
        <p className="text-body-sm text-ink-50 leading-relaxed mb-6">
          We will save your recommendation securely. Sign in or create a free
          account to continue.
        </p>
      )}

      <div className="card mb-6">
        <p className="section-label mb-3">What gets saved</p>
        <div className="flex flex-col gap-3">
          {[
            "Your recommendation and full reasoning",
            "The trade-off and assumptions",
            "Your original situation for context",
            "Access from any device",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 bg-brand-teal-light rounded-full
                              flex items-center justify-center flex-shrink-0"
              >
                <svg
                  width="10"
                  height="10"
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
              <p className="text-body-sm text-ink-80">{item}</p>
            </div>
          ))}
        </div>
      </div>

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

      <div className="flex flex-col gap-3 mt-auto">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving || savingDraft || !recommendation}
        >
          {savingDraft ? (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 border-2 border-white
                              border-t-transparent rounded-full animate-spin"
              />
              <span>Securing your recommendation...</span>
            </div>
          ) : saving ? (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 border-2 border-white
                              border-t-transparent rounded-full animate-spin"
              />
              <span>Saving...</span>
            </div>
          ) : (
            "Save this decision"
          )}
        </button>

        <button className="btn-ghost" onClick={() => navigate(-1)}>
          Not now
        </button>
      </div>
    </div>
  );
}
