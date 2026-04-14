import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

export default function LandingScreen() {
  const navigate = useNavigate()

  const scenarios = [
    { label: 'Which insurance plan is right for me at 27?', time: '~3 min', color: 'bg-brand-purple' },
    { label: 'New job offer vs staying for ESOPs?',          time: '~5 min', color: 'bg-brand-teal-mid' },
    { label: 'How should I invest my first Rs 50,000?',      time: '~4 min', color: 'bg-ink-30' },
  ]

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col px-5 pb-10">

      {/* Status bar spacer */}
      <div className="h-12" />

      {/* Wordmark */}
      <div className="flex items-center gap-2 mb-11">
        <div className="w-7 h-7 bg-brand-purple rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" fill="none" stroke="white"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <span className="text-[16px] font-bold text-ink-100 tracking-tight">
          Clarix
        </span>
      </div>

      {/* Hero */}
      <div className="mb-7">
        <h1 className="text-[36px] font-extrabold text-ink-100 leading-[1.1]
                       tracking-tight mb-4">
          Stop researching.<br />
          <span className="text-brand-purple">Start deciding.</span>
        </h1>
        <p className="text-body-lg text-ink-50 leading-relaxed">
          Describe your situation once. Get one clear recommendation
          built around your income, your goals, your life.
        </p>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Scenario list */}
      <div className="flex flex-col mb-7">
        {scenarios.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 py-[14px]
                       border-b border-[rgba(26,25,23,0.06)] last:border-b-0
                       cursor-pointer"
            onClick={() => navigate(ROUTES.INTAKE)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full ${s.color} mt-[6px] flex-shrink-0`} />
              <span className="text-[14px] font-medium text-ink-80 leading-snug">
                {s.label}
              </span>
            </div>
            <span className="text-caption text-ink-30 whitespace-nowrap flex-shrink-0">
              {s.time}
            </span>
          </div>
        ))}
      </div>

      {/* Trust block */}
      <div className="card flex items-start gap-3 mb-7">
        <div className="w-8 h-8 bg-brand-teal-light rounded-lg flex items-center
                        justify-center flex-shrink-0 mt-[2px]">
          <svg width="16" height="16" fill="none" stroke="#0F6E56"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <p className="text-body-sm text-ink-50 leading-relaxed">
          <span className="font-semibold text-ink-100">
            No commissions. No ads. Ever.
          </span>{' '}
          Clarix earns only from your subscription — so the recommendation
          is always in your interest, not ours.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          className="btn-primary"
          onClick={() => navigate(ROUTES.INTAKE)}
        >
          <svg width="16" height="16" fill="none" stroke="white"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Try it free — no account needed
        </button>
        <button
          className="btn-ghost"
          onClick={() => navigate(ROUTES.SIGN_IN)}
        >
          Sign in to existing account
        </button>
      </div>

    </div>
  )
}
