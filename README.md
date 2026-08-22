# ALPHA — AI Trading Suite

ALPHA is a full-stack Node.js application with a dynamic Bento-grid UI, user approvals, owner administration, account/balance monitoring, audit logs, a technical-signal ensemble, historical backtesting, and TickerAll connectivity for MT4/MT5 broker accounts.

## Important operating notes

- Real-money order placement is intentionally **disabled in this build**. `LIVE_ORDER_EXECUTION=false` is hard-coded as the safe default and the broker adapter rejects live order writes unless the product is explicitly extended and independently reviewed.
- The backtester and broker-read layer are functional. You can connect a demo/real account for account state, candles, positions and history, subject to your TickerAll plan and broker permissions.
- No strategy can guarantee profit or a 10× return. “Auto compounding” is modeled as equity-based sizing in backtests; it does not create a return guarantee.
- The Shariah module is a screening aid, not a fatwa. Symbols without required fundamentals are marked `needs_review` and are excluded.

## Run

```bash
npm install
cp .env.example .env
# create a 32-byte hex key, e.g.:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# put the result into ENCRYPTION_KEY
npm run migrate
npm run create-owner
npm run screen
npm run dev
```

Open `http://localhost:3000`.

## Owner bootstrap

The owner email/password are read from `OWNER_EMAIL` and `OWNER_PASSWORD` and are hashed into SQLite. The plaintext password is never stored in the database and is never sent to the browser.

## TickerAll

Set `TICKERALL_API_KEY` only on the server. Each user connects an MT4/MT5 account through the ALPHA settings page; broker credentials are encrypted at rest with AES-256-GCM and are never returned to the browser after saving.

## Architecture

- `src/trading-engine.js` — session lifecycle, tick loop, account sync, signal evaluation.
- `src/ai/signal-engine.js` — deterministic ensemble of EMA, RSI, MACD, ATR, momentum and volatility features.
- `src/backtest.js` — historical simulation with position sizing, stops, targets and performance metrics.
- `src/brokers/tickerall.js` — TickerAll REST adapter.
- `src/shariah/screening.js` — rule-based screening and overrides file.
- `public/` — dynamic Bento-grid SPA.

For live order execution, keep it disabled until the broker contract, Shariah position structure, execution semantics, and safety controls have been independently reviewed.
