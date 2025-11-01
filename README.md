# PrepGen EdTech Platform

Next.js powered learning companion that blends AI-generated course content with a subscription sandbox. Use it to experiment with Gemini/OpenAI assisted course generation, local storage fallbacks, and a full Stripe subscription checkout that you can run end-to-end in test mode.

## Highlights

- **AI tooling** – Generate courses, chapters, flashcards, notes, and quizzes using Gemini and OpenAI backed API routes.
- **Dashboard-first UX** – Clerk authentication, localStorage course persistence, and polished Tailwind UI components for learners.
- **Stripe subscription demo** – Custom Checkout flow with Payment + Address Elements mounted inside `/subscribe`, webhook handling, and cancellation helpers.
- **Serverless friendly** – API routes run in the App Router, with Inngest stubs for local development and optional Neon/Postgres integration.

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Copy environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Populate the Stripe, Clerk, OpenAI/Gemini, database, and Inngest values. At a minimum the Stripe demo needs:

   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID` (recurring price to sell)
   - `STRIPE_WEBHOOK_SECRET` (from `stripe listen` or Dashboard)

3. **Run the dev server**

   ```bash
   pnpm dev
   ```

4. **Explore core flows**

   - `/dashboard` – view locally stored courses and AI generated outlines.
   - `/create` – generate new material with fallback storage when APIs are unavailable.
   - `/subscribe` – walk through the end-to-end Stripe subscription sample described below.

## Stripe subscription sandbox

The `/subscribe` route implements the full sequence from the Stripe docs:

1. **Register a customer** – collect email, name, and address, call `POST /api/stripe/create-customer`, and cache the returned customer ID locally (or persist it via your own DB).
2. **Create a Checkout Session** – trigger `POST /api/stripe/create-checkout-session` with the stored customer and price ID. The response includes the client secret for `stripe.initCheckout`.
3. **Mount Elements** – use the returned Checkout instance to mount the Payment Element and Address Element into the page, preview line items, and display totals.
4. **Confirm payment** – call `actions.confirm()` to complete the subscription. The UI surfaces success or validation errors and stores the resulting subscription ID.
5. **Cancel** – `POST /api/stripe/cancel-subscription` uses `stripe.subscriptions.del` so you can test downgrade flows.

### Webhooks

- Local development: run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and watch events propagate through the `stripeStore` in-memory cache.
- Production: point a Stripe webhook endpoint at `/api/stripe/webhook` and replace the temporary Map store with your database of choice.

## Tech Stack

- **Framework**: Next.js App Router, React 18
- **Styling**: Tailwind CSS, custom UI components
- **Auth**: Clerk
- **AI**: Google Generative AI (Gemini), OpenAI Chat API
- **Payments**: Stripe (custom Checkout + Elements demo)
- **Background jobs**: Inngest (local stubbed)
- **Data**: LocalStorage fallbacks, optional Neon/Postgres via Drizzle ORM

## Development tips

- Use the provided `configs/stripeStore.js` as a temporary cache; swap it with a persistent store when rolling out real subscriptions.
- All Stripe API helpers live under `app/api/stripe/*`. Each handler asserts the presence of `STRIPE_SECRET_KEY` before making API calls.
- The `.env.example` file documents every variable the app reads—keep real secrets in `.env.local`.
- When testing webhooks alongside the dev server, keep two terminals running: one for `pnpm dev` and one for `stripe listen`.

## Contributing

Issues and PRs are welcome. Please describe the feature or bugfix, include tests when practical, and avoid committing real API keys or personal data.

## License

MIT – see `LICENSE` for details.
