import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

function IconDecide({ active }) {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke={active ? "#534AB7" : "#9C9A92"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconHistory({ active }) {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke={active ? "#534AB7" : "#9C9A92"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="12 20 12 10" />
      <polyline points="18 20 18 4" />
      <polyline points="6 20 6 16" />
    </svg>
  );
}

function IconAccount({ active }) {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke={active ? "#534AB7" : "#9C9A92"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

const TABS = [
  {
    id: "decide",
    label: "Decide",
    route: ROUTES.HOME,
    Icon: IconDecide,
  },
  {
    id: "history",
    label: "History",
    route: ROUTES.HISTORY,
    Icon: IconHistory,
  },
  {
    id: "account",
    label: "Account",
    route: ROUTES.ACCOUNT,
    Icon: IconAccount,
  },
];

export default function BottomNav({ active }) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
                    max-w-[480px] bg-surface-0
                    border-t border-[rgba(26,25,23,0.07)]
                    flex pb-4 pt-2 z-50"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.route)}
            className="flex-1 flex flex-col items-center gap-[3px]
                       cursor-pointer"
            aria-label={tab.label}
          >
            <tab.Icon active={isActive} />
            <span
              className={`text-[9px] font-bold tracking-[0.03em]
                              ${isActive ? "text-brand-purple" : "text-ink-30"}`}
            >
              {tab.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-brand-purple" />
            )}
          </button>
        );
      })}
    </div>
  );
}
