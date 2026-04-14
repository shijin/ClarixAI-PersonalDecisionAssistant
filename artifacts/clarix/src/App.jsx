import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './constants/routes'

// Public screens
import LandingScreen from './screens/public/LandingScreen'
import SharedRecommendationScreen from './screens/public/SharedRecommendationScreen'

// Auth screens
import SignInScreen from './screens/auth/SignInScreen'
import EmailVerificationScreen from './screens/auth/EmailVerificationScreen'

// Decision screens
import IntakeScreen from './screens/decision/IntakeScreen'
import FollowUpScreen from './screens/decision/FollowUpScreen'
import AssumptionScreen from './screens/decision/AssumptionScreen'
import ConversationScreen from './screens/decision/ConversationScreen'

// Result screens
import RecommendationScreen from './screens/result/RecommendationScreen'
import SavePromptScreen from './screens/result/SavePromptScreen'
import ShareScreen from './screens/result/ShareScreen'
import DefenceScreen from './screens/result/DefenceScreen'
import TradeoffDetailScreen from './screens/result/TradeoffDetailScreen'

// App screens
import HomeScreen from './screens/app/HomeScreen'
import HistoryScreen from './screens/app/HistoryScreen'
import PastDecisionScreen from './screens/app/PastDecisionScreen'
import ContextProfileScreen from './screens/app/ContextProfileScreen'

// Account screens
import AccountScreen from './screens/account/AccountScreen'
import NotificationsScreen from './screens/account/NotificationsScreen'
import BillingScreen from './screens/account/BillingScreen'
import HelpScreen from './screens/account/HelpScreen'

// Utility screens
import ErrorScreen from './screens/utility/ErrorScreen'
import EmptyStateScreen from './screens/utility/EmptyStateScreen'
import UpgradeScreen from './screens/utility/UpgradeScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path={ROUTES.LANDING}              element={<LandingScreen />} />
        <Route path={ROUTES.SHARED}               element={<SharedRecommendationScreen />} />

        {/* Auth */}
        <Route path={ROUTES.SIGN_IN}              element={<SignInScreen />} />
        <Route path={ROUTES.EMAIL_VERIFY}         element={<EmailVerificationScreen />} />

        {/* Decision flow */}
        <Route path={ROUTES.INTAKE}               element={<IntakeScreen />} />
        <Route path={ROUTES.FOLLOW_UP}            element={<FollowUpScreen />} />
        <Route path={ROUTES.ASSUMPTION}           element={<AssumptionScreen />} />
        <Route path={ROUTES.CONVERSATION}         element={<ConversationScreen />} />

        {/* Result */}
        <Route path={ROUTES.RECOMMENDATION}       element={<RecommendationScreen />} />
        <Route path={ROUTES.SAVE}                 element={<SavePromptScreen />} />
        <Route path={ROUTES.SHARE}                element={<ShareScreen />} />
        <Route path={ROUTES.DEFENCE}              element={<DefenceScreen />} />
        <Route path={ROUTES.TRADEOFF}             element={<TradeoffDetailScreen />} />

        {/* Authenticated app */}
        <Route path={ROUTES.HOME}                 element={<HomeScreen />} />
        <Route path={ROUTES.HISTORY}              element={<HistoryScreen />} />
        <Route path={ROUTES.PAST_DECISION}        element={<PastDecisionScreen />} />
        <Route path={ROUTES.CONTEXT_PROFILE}      element={<ContextProfileScreen />} />

        {/* Account */}
        <Route path={ROUTES.ACCOUNT}              element={<AccountScreen />} />
        <Route path={ROUTES.NOTIFICATIONS}        element={<NotificationsScreen />} />
        <Route path={ROUTES.BILLING}              element={<BillingScreen />} />
        <Route path={ROUTES.HELP}                 element={<HelpScreen />} />

        {/* Utility */}
        <Route path={ROUTES.ERROR}                element={<ErrorScreen />} />
        <Route path={ROUTES.UPGRADE}              element={<UpgradeScreen />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
