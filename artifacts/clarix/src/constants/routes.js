export const ROUTES = {
  // Public
  LANDING:         '/',
  SHARED:          '/s/:shareId',

  // Auth
  SIGN_IN:         '/sign-in',
  EMAIL_VERIFY:    '/verify',

  // Decision flow
  INTAKE:          '/decide',
  FOLLOW_UP:       '/decide/follow-up',
  ASSUMPTION:      '/decide/assumption',
  CONVERSATION:    '/decide/conversation',

  // Result
  RECOMMENDATION:  '/recommendation',
  SAVE:            '/recommendation/save',
  SHARE:           '/recommendation/share',
  DEFENCE:         '/recommendation/defence',
  TRADEOFF:        '/recommendation/tradeoff',

  // Authenticated app
  HOME:            '/home',
  HISTORY:         '/history',
  PAST_DECISION:   '/history/:decisionId',
  CONTEXT_PROFILE: '/profile',

  // Account
  ACCOUNT:         '/account',
  NOTIFICATIONS:   '/account/notifications',
  BILLING:         '/account/billing',
  HELP:            '/account/help',

  // Utility
  ERROR:           '/error',
  UPGRADE:         '/upgrade',
}
