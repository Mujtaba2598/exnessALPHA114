# Live trading status

This distribution deliberately does not place real-money broker orders. The TickerAll adapter supports account/session/candle/position/history reads, while the ALPHA engine produces and records signals for monitoring and backtesting.

The live order path is excluded rather than hidden behind a frontend switch. This prevents a UI mistake from turning into a real order.

Before any separate execution layer is added, independently review:

- broker order semantics and idempotency
- account/margin/volume constraints
- stop-loss and take-profit behavior
- kill-switch and daily-loss enforcement
- credential handling and incident recovery
- the exact Shariah structure of the instruments and account

No software configuration can guarantee a halal outcome or a 10× return.
