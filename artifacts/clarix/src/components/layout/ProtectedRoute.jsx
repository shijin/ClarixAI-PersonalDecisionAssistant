import { useUser } from "../../context/UserContext";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  // Still checking auth state — show nothing yet
  if (loading) {
    return (
      <div
        className="min-h-dvh bg-surface-1 flex items-center
                      justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-7 h-7 bg-brand-purple rounded-lg
                          flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1
                       2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
          </div>
          <div
            className="w-5 h-5 border-2 border-surface-3
                          border-t-brand-purple rounded-full animate-spin"
          />
        </div>
      </div>
    );
  }

  // Not signed in — save where they were trying to go
  // then redirect to sign in
  if (!user) {
    sessionStorage.setItem("clarix_return_to", window.location.pathname);
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  // Signed in — render the screen
  return children;
}
