import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useDecision } from "../../hooks/useDecision";
import { ROUTES } from "../../constants/routes";
import BottomNav from "../../components/layout/BottomNav";

export default function AccountScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const { fetchDecisions } = useDecision();

  const [decisionCount, setDecisionCount] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const firstName = user?.email?.split("@")[0] || "there";
  const email = user?.email || "";

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    const data = await fetchDecisions();
    setDecisionCount(data.length);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    navigate(ROUTES.LANDING);
  };

  const MenuRow = ({ label, sublabel, onPress, rightLabel, danger }) => (
    <button
      onClick={onPress}
      className="flex items-center justify-between gap-3 px-4 py-[14px]
                 bg-surface-0 border border-[rgba(26,25,23,0.08)]
                 rounded-xl text-left w-full
                 hover:border-[rgba(26,25,23,0.14)]
                 transition-colors duration-150"
    >
      <div className="flex flex-col gap-[2px] flex-1">
        <span
          className={`text-[14px] font-semibold
                          ${danger ? "text-semantic-error" : "text-ink-100"}`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="text-caption text-ink-30">{sublabel}</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {rightLabel && (
          <span className="text-caption text-ink-30">{rightLabel}</span>
        )}
        <svg
          width="14"
          height="14"
          fill="none"
          stroke={danger ? "#A32D2D" : "#9C9A92"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col pb-[72px]">
      <div className="h-12" />

      <div className="flex-1 px-5">
        {/* Header */}
        <h1
          className="text-[22px] font-extrabold text-ink-100
                       tracking-tight mb-6"
        >
          Account
        </h1>

        {/* Profile card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 bg-brand-purple rounded-xl
                            flex items-center justify-center flex-shrink-0"
            >
              <span className="text-[18px] font-bold text-white uppercase">
                {firstName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[15px] font-bold text-ink-100 capitalize
                            truncate"
              >
                {firstName}
              </p>
              <p className="text-body-sm text-ink-50 truncate">{email}</p>
            </div>
          </div>

          <div className="divider" />

          {/* Plan and usage */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-30 mb-1">Current plan</p>
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex items-center h-6 px-3
                                bg-brand-purple-light rounded-pill"
                >
                  <span
                    className="text-[11px] font-bold
                                   text-brand-purple-dark"
                  >
                    Free plan
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-caption text-ink-30 mb-1">Decisions saved</p>
              <p className="text-[18px] font-bold text-ink-100">
                {decisionCount}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.UPGRADE)}
            className="w-full h-10 bg-brand-purple text-white
                         rounded-lg text-[13px] font-bold mt-4
                         flex items-center justify-center gap-2
                         hover:bg-brand-purple-dark
                         transition-colors duration-150"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Upgrade to unlimited — Rs 199/month
          </button>
        </div>

        {/* Your data section */}
        <p className="section-label mb-3">Your data</p>
        <div className="flex flex-col gap-2 mb-6">
          <MenuRow
            label="Decision history"
            sublabel={decisionCount + " decisions saved"}
            rightLabel=""
            onPress={() => navigate(ROUTES.HISTORY)}
          />
          <MenuRow
            label="Your context profile"
            sublabel="Income, goals, and saved preferences"
            onPress={() => navigate(ROUTES.CONTEXT_PROFILE)}
          />
        </div>

        {/* Settings section */}
        <p className="section-label mb-3">Settings</p>
        <div className="flex flex-col gap-2 mb-6">
          <MenuRow
            label="Notifications"
            sublabel="Email reminders and product updates"
            onPress={() => navigate(ROUTES.NOTIFICATIONS)}
          />
          <MenuRow
            label="Subscription and billing"
            sublabel="Manage your plan"
            onPress={() => navigate(ROUTES.BILLING)}
          />
          <MenuRow
            label="Help and about"
            sublabel="How Clarix works and how to get support"
            onPress={() => navigate(ROUTES.HELP)}
          />
        </div>

        {/* Sign out */}
        <p className="section-label mb-3">Session</p>
        <div className="flex flex-col gap-2">
          {!showConfirm ? (
            <MenuRow
              label="Sign out"
              sublabel={"Signed in as " + email}
              onPress={() => setShowConfirm(true)}
              danger
            />
          ) : (
            <div className="card border-[rgba(163,45,45,0.25)]">
              <p className="text-[14px] font-semibold text-ink-100 mb-1">
                Sign out of Clarix?
              </p>
              <p className="text-body-sm text-ink-50 mb-4">
                Your saved decisions will still be here when you sign back in.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex-1 h-10 bg-semantic-error text-white
                             rounded-lg text-[13px] font-bold
                             flex items-center justify-center gap-2"
                >
                  {signingOut ? (
                    <div
                      className="w-3 h-3 border-2 border-white
                                    border-t-transparent rounded-full
                                    animate-spin"
                    />
                  ) : (
                    "Sign out"
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 h-10 bg-surface-2 text-ink-80
                             rounded-lg text-[13px] font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* App info */}
        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
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
            Clarix · V1.0 · No ads · No commissions
          </span>
        </div>
      </div>

      <BottomNav active="account" />
    </div>
  );
}
