# SubTrack AI – Subscription Reminder and Cancellation Assistant

## Problem statement
People often forget free-trial expiry dates and recurring subscription payments, which can lead to unwanted charges and difficult cancellation journeys.

## Proposed solution
SubTrack AI is a beginner-friendly browser prototype for adding subscriptions, tracking renewal dates, estimating monthly and yearly costs, seeing in-app reminders, and following cancellation guidance.

## Features
- Dynamic dashboard with active subscriptions, monthly/yearly estimates, upcoming renewals, reminders, recent activity, and category spending.
- Add, edit, search, filter, sort, and delete subscriptions.
- Free-trial tracking and reminders for upcoming or ended trials.
- Cancellation assistant with provider links and a step-by-step checklist.
- Demo subscriptions on first launch: Netflix, Spotify, Canva, and Amazon Prime.
- Responsive desktop, tablet, and mobile layout.

## Technologies used
- React
- TanStack Router for page navigation
- Tailwind CSS
- Browser LocalStorage
- Lucide React icons

## LocalStorage explanation
All subscription records are saved under the `subtrack_subscriptions` LocalStorage key. The app reads this data when it opens and updates it immediately after additions, edits, and deletions. Data remains after refreshing in the same browser.

## Installation
```sh
npm install
```

## Run instructions
```sh
npm run dev
```

Then open the local development URL shown in the terminal.

## Limitations
- No login system.
- No external database.
- No real email or push notifications.
- No automatic cancellation.
- Data is stored only in the current browser.
- Reminder calculations use the current browser date and remain in-app only.

## Future enhancements
- Optional account sync across devices.
- Calendar export and richer reminder preferences.
- Provider-specific cancellation help content.
- Spending trends and budget alerts.
