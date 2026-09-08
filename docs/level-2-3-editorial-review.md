# Level 2 and 3 editorial and interaction pass

Date: 2026-09-09. Local preview only; not pushed or deployed.

## Scope and changes

Scanned the explanations and examples across 437 Applied/Professional lessons and selectively revised 109 authored records across 27 modules. Preserved existing good content and Level 1. This is a targeted editorial pass, not independent financial certification or manual interaction testing of every lesson.

- Removed unsupported certainty about patterns, mean reversion, stops, open interest and volatility premiums. Made examples and corresponding questions/feedback consistent where revised.
- Corrected leverage, risk/reward, futures mark-to-market, compounded drawdown and recovery-factor calculations.
- Fixed Professional VOL/RISK lessons accidentally entering the Foundations visual dispatcher.
- Replaced approximate option outputs with an explicitly simplified European option model; derived strategy profits from actual legs. Calendars retain the long option's model value at front expiry.
- Futures hedges change Delta only; removed fabricated confidence/return estimates. Clarified portfolio, screening, regime and state-machine assumptions.
- Improved mobile scenario introduction and payoff-label readability. Explicitly distinguish adjustable practice contracts from written examples.

## Language reader

Added an optional lesson reading aid with English and ten translation languages. Supported browsers can translate on-device after downloading a language pack. Google Translate links provide an explicit external fallback, separately for explanation/example and question/choices. Language preference persists locally; quiz state and original English are preserved.

This is not full-interface localisation. Mobile/browser support varies. Google receives the selected lesson text only when its link is opened; no learner progress is included. Financial terminology in machine translation may need comparison with English.

References: [Chrome Translator API](https://developer.chrome.com/docs/ai/translator-api), [Google website translation support and widget eligibility](https://support.google.com/translate/answer/2534559?hl=en), [OCC calendar spreads](https://prd-web.optionseducation.org/strategies/all-strategies/long-call-calendar-spread-call-horizontal), [OCC Gamma](https://prd-web.optionseducation.org/advancedconcepts/gamma).

## Verification

- Production Sites build and 24 automated tests passed, including initial rendering of all 437 advanced and 138 Foundation visuals through the dispatcher.
- Content audit passed for 575 lessons: no missing authored fields, invalid answers or dangling prerequisites.
- ESLint passed.
- Browser: Professional volatility slider updated IV 22 to 23 and the difference 6 to 7 percentage points. Payoff structure tabs switched; calendar IV 18 to 19 changed model P&L from approximately +375 to +403 per unit.
- Visually inspected mobile 393×873 and the normal desktop preview (approximately 1265×712); mobile overflow check passed. Temporary viewport override reset. These checks do not represent a fresh exhaustive device matrix.
- Language selection and Google link parameters checked. Native translation remained at language-pack preparation, so successful translated output is not verified. Added timeout and fallback guidance.

## Remaining limitations

- Standalone TypeScript checking still reports existing generated Next route-type and Cloudflare worker binding/type configuration errors; production build passes. Build also retains its large-chunk warning.
- Shared module workbenches remain in places; not every lesson has a bespoke visual. Standalone legacy Labs were not rewritten in this lesson-focused pass.
- All advanced initial states render, but every possible interactive path was not manually tested.
- Native translation and external Google completion require further supported-browser testing. This pass does not promise automatic inline translation on Android.

## Files

Lesson UI: app/page.tsx, app/applied-visuals.tsx, app/professional-visuals.tsx, app/globals.css, app/lesson-translation.tsx.

Math: lib/advanced-math.ts. Content: lib/content/{applied,professional,screening,swing,intraday,positional,workflow,patterns}.ts.

Tests: tests/advanced-math.test.mjs, tests/foundation-render.test.mjs, package.json.
