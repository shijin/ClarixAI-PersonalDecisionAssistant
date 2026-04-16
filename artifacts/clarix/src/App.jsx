import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Public screens
import LandingScreen from "./screens/public/LandingScreen";
import SharedRecommendationScreen from "./screens/public/SharedRecommendationScreen";

// Auth screens
import AuthCallbackScreen from "./screens/auth/AuthCallbackScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import EmailVerificationScreen from "./screens/auth/EmailVerificationScreen";

// Decision screens
import IntakeScreen from "./screens/decision/IntakeScreen";
import FollowUpScreen from "./screens/decision/FollowUpScreen";
import AssumptionScreen from "./screens/decision/AssumptionScreen";
import ConversationScreen from "./screens/decision/ConversationScreen";

// Result screens
import RecommendationScreen from "./screens/result/RecommendationScreen";
import SavePromptScreen from "./screens/result/SavePromptScreen";
import ShareScreen from "./screens/result/ShareScreen";
import DefenceScreen from "./screens/result/DefenceScreen";
import TradeoffDetailScreen from "./screens/result/TradeoffDetailScreen";

// App screens — protected
import HomeScreen from "./screens/app/HomeScreen";
import HistoryScreen from "./screens/app/HistoryScreen";
import PastDecisionScreen from "./screens/app/PastDecisionScreen";
import ContextProfileScreen from "./screens/app/ContextProfileScreen";

// Account screens — protected
import AccountScreen from "./screens/account/AccountScreen";
import NotificationsScreen from "./screens/account/NotificationsScreen";
import BillingScreen from "./screens/account/BillingScreen";
import HelpScreen from "./screens/account/HelpScreen";

// Utility screens
import ErrorScreen from "./screens/utility/ErrorScreen";
import EmptyStateScreen from "./screens/utility/EmptyStateScreen";
import UpgradeScreen from "./screens/utility/UpgradeScreen";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

// ─────────────────────────────────────
// Global auth handler
// Runs on every page load and checks
// for Supabase tokens in the URL hash
// This handles email verification redirects
// ─────────────────────────────────────

function useAuthHandler() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Check for pending draft
        const urlParams = new URLSearchParams(window.location.search);
        const draftId =
          urlParams.get("draft") || localStorage.getItem("clarix_draft_id");

        if (draftId) {
          const { data: draft, error } = await supabase
            .from("drafts")
            .select("*")
            .eq("session_id", draftId)
            .single();

          if (!error && draft) {
            sessionStorage.setItem("clarix_situation", draft.situation);
            sessionStorage.setItem(
              "clarix_recommendation",
              JSON.stringify(draft.recommendation),
            );
            localStorage.removeItem("clarix_draft_id");

            // Navigate to save prompt
            window.location.href = "/save";
            return;
          }
        }

        // No draft — if we are on the landing page go to home
        if (window.location.pathname === "/") {
          window.location.href = "/home";
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}

function AuthStateHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        const sit = localStorage.getItem("clarix_situation");
        const rec = localStorage.getItem("clarix_recommendation");
        if (sit && rec) {
          navigate("/save");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return null;
}

export default function App() {
  useAuthHandler();
  return (
    <BrowserRouter>
      <AuthStateHandler />
      <Routes>
        {/* ── Public — no auth required ── */}
        <Route path={ROUTES.LANDING} element={<LandingScreen />} />
        <Route path={ROUTES.SHARED} element={<SharedRecommendationScreen />} />

        {/* ── Auth screens ── */}
        <Route path={ROUTES.SIGN_IN} element={<SignInScreen />} />
        <Route
          path={ROUTES.EMAIL_VERIFY}
          element={<EmailVerificationScreen />}
        />

        <Route path="/auth/callback" element={<AuthCallbackScreen />} />

        {/* ── Decision flow — public ── */}
        {/* Users can start a decision without signing in.  */}
        {/* Auth is only required to save the result.       */}
        <Route path={ROUTES.INTAKE} element={<IntakeScreen />} />
        <Route path={ROUTES.FOLLOW_UP} element={<FollowUpScreen />} />
        <Route path={ROUTES.ASSUMPTION} element={<AssumptionScreen />} />
        <Route path={ROUTES.CONVERSATION} element={<ConversationScreen />} />

        {/* ── Result screens — public ── */}
        {/* Recommendation is readable without auth.        */}
        {/* Save and share require auth.                    */}
        <Route
          path={ROUTES.RECOMMENDATION}
          element={<RecommendationScreen />}
        />
        <Route path={ROUTES.TRADEOFF} element={<TradeoffDetailScreen />} />

        {/* ── Save and share — protected ── */}
        <Route path={ROUTES.SAVE} element={<SavePromptScreen />} />
        <Route
          path={ROUTES.SHARE}
          element={
            <ProtectedRoute>
              <ShareScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.DEFENCE}
          element={
            <ProtectedRoute>
              <DefenceScreen />
            </ProtectedRoute>
          }
        />

        {/* ── Authenticated app — protected ── */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HISTORY}
          element={
            <ProtectedRoute>
              <HistoryScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAST_DECISION}
          element={
            <ProtectedRoute>
              <PastDecisionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONTEXT_PROFILE}
          element={
            <ProtectedRoute>
              <ContextProfileScreen />
            </ProtectedRoute>
          }
        />

        {/* ── Account — protected ── */}
        <Route
          path={ROUTES.ACCOUNT}
          element={
            <ProtectedRoute>
              <AccountScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <ProtectedRoute>
              <NotificationsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.BILLING}
          element={
            <ProtectedRoute>
              <BillingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HELP}
          element={
            <ProtectedRoute>
              <HelpScreen />
            </ProtectedRoute>
          }
        />

        {/* ── Utility ── */}
        <Route path={ROUTES.ERROR} element={<ErrorScreen />} />
        <Route path={ROUTES.UPGRADE} element={<UpgradeScreen />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
