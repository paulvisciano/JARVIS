# Currency Context Awareness — Location Matters

**Date:** 2026-03-27
**Type:** insight
**Status:** extracted

## The Incident

Paul mentioned "1,500" for the Oasis 8 hotel. Jarvis assumed **dollars** ($1,500 USD). Paul corrected: **baht** (1,500 THB ≈ $43 USD).

## The Real Tally

| Item | Jarvis Assumed | Actual |
|------|----------------|--------|
| Oasis 8 hotel | $1,500 USD | 1,500 baht (~$43 USD) |
| Tony tip | $400 USD | 400 baht (~$11 USD) |
| **Total** | **~$1,900 USD** | **~$54 USD** |

## The Lesson

**Location context matters.** When Paul is traveling (Bangkok, Thailand), currency defaults should be local (baht), not USD. This applies to:

- Prices mentioned in conversation
- Budget calculations
- Expense tracking
- Travel planning

## The Fix

1. Track Paul's current location in neurograph (place node with temporal link)
2. When location = Thailand → default currency = THB
3. When location = US → default currency = USD
4. Explicitly confirm when large numbers are mentioned ("1,500 dollars or baht?")

## The Deeper Truth

Context isn't just conversation history. It's **geography, culture, local norms**. A truly sovereign AI knows where you are — not just what you said.