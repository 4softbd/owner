# BuyFinix v2

Fresh BuyFinix marketplace codebase for subscriptions, AI tools, Adobe, VPN, gift cards, Steam/Epic games and game top-ups.

## Setup

1. Copy `.env.example` to `.env` and set secure production values.
2. Install dependencies with `npm install`.
3. Create the fresh schema and starter catalog with `npm run db:init`.
4. Build with `npm run build`.
5. Start with `npm start`.

## Intentional full reset

This permanently erases BuyFinix tables in the configured database:

```bash
CONFIRM_RESET=BUYFINIX_RESET_ALL npm run db:reset
npm run db:init
```

Verify `DATABASE_URL` before running the reset. The reset is deliberately protected and never runs during deployment automatically.
