# Level 1 editorial and interaction review

Reviewed: 7 September 2026. Scope: all 138 Level 1 lessons in 11 modules. This is an editorial, mathematical and interaction review—not independent investment-advice certification or a backtest of trading rules.

82 authored lesson records received targeted changes; 56 were retained. Shared visual improvements also affect retained lessons. Lesson IDs, progress storage, unlock rules, course structure, colours and the existing Sites/Vercel configuration are preserved. Three lesson titles and three module summaries were adjusted where the wording contradicted the corrected content.

## Module coverage

| Module | Lessons reviewed | Authored records edited | Main decision |
|---|---:|---:|---|
| Financial Markets | 15 | 9 | Simpler opening explanation; ordinary currency/share examples; fresh IPO shares versus offer-for-sale proceeds; clearer capital and index concepts. |
| How Trading Works | 15 | 8 | Order acceptance versus execution; qualified fills and settlement; actual-fill P&L without double-counting spread; worked example and initial controls agree. |
| Orders and Execution | 10 | 7 | Stop trigger versus fill; valid sell-limit scenario; coherent partial-fill book; paise retained in quoted prices; execution-cost arithmetic. |
| Reading Charts | 12 | 2 | Equal wicks correctly described; accurately positioned OHLC bodies and wicks; genuine same-window aggregation; alternative paths with identical OHLC. |
| Trading Horizons | 9 | 7 | Realistic schedules and event exposure; no automatic safe horizon or stop distance; investing still requires valuation and risk review. |
| Market Structure | 14 | 6 | Lower highs/lows clarified; failed breakouts without invented motives; reversal order not universal; selectable swings report their actual values. |
| Candlestick Patterns | 14 | 10 | Doji arithmetic and definition; body containment; morning/evening-star qualifications; completed-candle context; no universal hit-rate claim. Historical NIFTY illustrations retained. |
| Volume and Volatility | 10 | 8 | Units traded rather than people; low activity distinguished from depth; gap-aware true range; stop distance connected to quantity, not guaranteed safety. |
| Indicators | 13 | 7 | Market-data inputs; proper RSI gain/loss averaging; true range rather than arbitrary ATR output; distinct SMA/EMA curves; overlapping evidence explained. |
| Finding Stocks to Trade | 8 | 8 | Removed unnecessary fictional-company backstories and false precision; inspectable shortlist exclusions; matched risk-budget comparisons; no rejection quota. |
| Risk Management | 18 | 10 | Planned versus realised loss; rounded whole-share sizing; expectancy assumptions; correct compounding/ruin arithmetic; working process checklist. |

## Editorial principles

- Start with the idea before introducing its technical name.
- Use everyday examples when they clarify the concept. Do not invent precise trading outcomes or company histories to make a lesson sound authentic.
- Keep mathematical practice data explicitly labelled. Historical candle examples remain historical, not simulated forecasts.
- Distinguish a planned stop, risk budget and estimated expectancy from a guaranteed outcome.
- Align the opening, explanation, example, quiz, feedback and comparison/sequence data. Do not change correct material just to change its tone.

## Validation

- Sites production build passed; 19 tests passed. The new render test covers all 138 Level 1 visual initial states, non-empty output, finite results and named sliders within bounds.
- New calculation regressions cover OHLC aggregation, gaps in both directions, paise-accurate order fills, partial quantities, actual-fill P&L and distinct SMA/EMA calculations.
- ESLint passed. Curriculum audit passed: 575 authored lessons, no missing records, invalid choices or dangling prerequisites; Level 1 still has 138 lessons and no prediction blocks.
- Browser spot-checks covered all 11 modules. Specifically verified all five instrument tabs; changing a partial order to 600 shares leaves 180 filled and 420 pending; a one-hour candle replaces twelve five-minute candles while preserving the hour; previous close ₹114 gives true range ₹10 for high ₹108/low ₹104; zero/zero RSI inputs show an undefined explanation; screening filters explain exclusions; the process checklist updates its count; the ₹114 swing compares with the prior ₹121 high; investing starts on its own horizon; historical hammer/hanging-man comparison switches the chart; P&L begins at ₹260, matching its worked example.
- Visually inspected the lesson at a 1600×1000 desktop viewport and the stacked visual at 393×873. Mobile plot labels were enlarged after inspection. No horizontal overflow observed at the confirmed 360, 375, 393 and 1920 viewport checks. This is representative responsive QA, not exhaustive testing of every interaction at every size or 200% text zoom.

## Existing limitations, not hidden passes

The repository-wide TypeScript check is not clean. It reports errors in unchanged Level 2/3 visual files, generated Next route types, and missing Cloudflare Worker/D1 type declarations. No errors are reported in the edited Level 1 files. Those out-of-scope errors were not silently repaired or suppressed. The Sites build and runtime tests pass, but this report does not claim a clean Vercel/Next production build.

The build also retains its large-chunk warning. Course content is still marked draft. The separate standalone labs and Levels 2/3 were not comprehensively re-audited in this pass.

## Factual references consulted

- Primary issuance and offer-for-sale distinction: [SEBI IPO investor material](https://investor.sebi.gov.in/pdf/reference-material/ppt/PPT-3%20How%20to%20invest%20in%20Intial%20Public%20Offer_%20Feb%202025.pdf).
- Order matching and execution rules: [NSE trading system](https://www.nseindia.com/static/products-services/equity-market-trading-system) and [NSE limit-price protection FAQs](https://www.nseindia.com/static/trade/limit-price-protection-faqs).
- Gap-aware range calculation: [Fidelity ATR guide](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/atr).
- Relative gains/losses and interpretive limits: [Fidelity RSI guide](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/RSI).

## Release and later work

The review was handed off in the local preview before publishing. The user subsequently approved pushing this reviewed source to GitHub and publishing to the existing public Sites audience. Deployment status is tracked by Sites rather than this review snapshot. Language selection is deliberately deferred; no translation service, backend translation workflow, subscription or external data-sharing integration was added.

## Edited authored lesson IDs

FND-CANDLE-001, FND-CANDLE-002, FND-CANDLE-007, FND-CANDLE-008, FND-CANDLE-009, FND-CANDLE-010, FND-CANDLE-011, FND-CANDLE-012, FND-CANDLE-013, FND-CANDLE-014, FND-CHART-004, FND-CHART-008, FND-HZN-001, FND-HZN-003, FND-HZN-004, FND-HZN-005, FND-HZN-006, FND-HZN-007, FND-HZN-009, FND-IND-001, FND-IND-002, FND-IND-007, FND-IND-009, FND-IND-010, FND-IND-012, FND-IND-013, FND-MKT-001, FND-MKT-002, FND-MKT-004, FND-MKT-005, FND-MKT-007, FND-MKT-008, FND-MKT-011, FND-MKT-013, FND-MKT-015, FND-ORD-001, FND-ORD-002, FND-ORD-003, FND-ORD-004, FND-ORD-005, FND-ORD-007, FND-ORD-010, FND-PICK-001, FND-PICK-002, FND-PICK-003, FND-PICK-004, FND-PICK-005, FND-PICK-006, FND-PICK-007, FND-PICK-008, FND-RISK-001, FND-RISK-002, FND-RISK-003, FND-RISK-007, FND-RISK-008, FND-RISK-010, FND-RISK-012, FND-RISK-014, FND-RISK-015, FND-RISK-017, FND-STRUCT-003, FND-STRUCT-004, FND-STRUCT-008, FND-STRUCT-011, FND-STRUCT-012, FND-STRUCT-013, FND-VOL-001, FND-VOL-002, FND-VOL-004, FND-VOL-006, FND-VOL-007, FND-VOL-008, FND-VOL-009, FND-VOL-010, FND-WORK-001, FND-WORK-003, FND-WORK-006, FND-WORK-008, FND-WORK-011, FND-WORK-012, FND-WORK-013, FND-WORK-014
