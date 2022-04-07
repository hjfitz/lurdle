import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'
import LogRocket from 'logrocket'

LogRocket.init('8ydpeu/lurdle-hjf-io')

Sentry.init({
	dsn: 'https://3b791ef481194a3e889182619e2e2918@o877428.ingest.sentry.io/6316033',
	integrations: [new BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
})

Sentry.configureScope((scope) => {
	scope.setExtra('sessionURL', LogRocket.sessionURL)
})
