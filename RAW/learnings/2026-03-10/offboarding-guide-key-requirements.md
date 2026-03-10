# OutSystems Offboarding Guide — Key Requirements & Deadlines

**Date:** March 10, 2026, 10:38 PM  
**Type:** Learning / Administrative / Benefits & Equity  
**Source:** PDF document (692 KB, 6 pages) — OutSystems HR offboarding guide

---

## Critical Deadlines (Based on Feb 27 Termination Date)

### Health Insurance
- **Coverage ends:** February 28, 2026 (end of month)
- **COBRA letter:** From HealthEquity within 2 weeks
- **COBRA enrollment window:** 60 days from termination

### Equity (Shareworks Platform)
- **Contact:** 1-877-380-7793 (North America, 8 AM - 8 PM ET)
- **Stock options:** Eligible for next exercise window (forfeit if not exercised)
- **RSUs:** 
  - <3 years service → ALL canceled
  - 3+ years service → Keep vested portion (time-based only)
  - 7-year term → Must have liquidity event (IPO/acquisition) by grant date + 7 years

### Expense Reports
- **Deadline:** BEFORE last day (Feb 27 already passed)
- **Action:** Submit manual expense report sheet with receipts to people@outsystems.com

### Personal Information Updates
- **Workday:** Update personal email, phone, address (critical for equity contact)
- **TriNet:** Update address (where tax docs, checks sent)
- **Shareworks:** Update personal email (equity notices)

### Google Drive
- **Action:** Retrieve personal files ASAP
- **Risk:** Ownership transfers to manager after termination

### Equipment Return
- **Status:** Shipping label received
- **Action:** Return laptop, iPad (if applicable) via provided label

---

## Key Learnings Extracted

### 1. **Health Coverage Ends Month-End**
**Rule:** Coverage lasts until end of month of termination date  
**Impact:** Feb 27 termination → Feb 28 coverage end (not March 31)  
**Action:** Plan for COBRA or alternative coverage starting March 1

**Neuron:** `health-insurance-month-end-rule`  
**Type:** benefits  
**Connected to:** termination, cobra, healthcare

---

### 2. **RSU Vesting Cliff (3 Years)**
**Rule:** <3 years = all RSUs canceled. 3+ years = keep vested portion.  
**Impact:** If Paul has <3 years tenure → entire RSU grant forfeited  
**Context:** RSUs have dual trigger (time + liquidity event)

**Neuron:** `rsu-vesting-cliff-3-years`  
**Type:** equity  
**Connected to:** stock-options, liquidity-event, forfeiture

---

### 3. **Stock Option Exercise Windows**
**Rule:** Vested options eligible for next exercise window only  
**Impact:** Miss the window → forfeit forever  
**Special:** 10+ years service → 3 windows (if priced below EUR 13.85)

**Neuron:** `stock-option-exercise-windows`  
**Type:** equity  
**Connected to:** vested-options, forfeiture-rules

---

### 4. **Personal Info Critical For Equity**
**Rule:** Must update personal email in Workday + Shareworks  
**Impact:** No valid email → miss equity notices → miss exercise windows → forfeit  
**Action:** Update immediately (before losing SSO access)

**Neuron:** `personal-info-critical-for-equity`  
**Type:** administrative  
**Connected to:** shareworks, workday, equity-notices

---

### 5. **Google Drive Ownership Transfer**
**Rule:** All Drive files transfer to manager after termination  
**Impact:** Personal files lost if not retrieved  
**Action:** Download personal docs ASAP

**Neuron:** `google-drive-ownership-transfer`  
**Type:** administrative  
**Connected to:** data-retrieval, termination-process

---

## Files Archived

**Document:**
- `offboarding-guide-outsystems.pdf` (692 KB, 6 pages)
- Location: `~/RAW/archive/2026-03-10/documents/`
- Extracted text: Full OCR + text extraction

---

## Neurograph Integration

**Create neurons:**
1. `health-insurance-month-end-rule` (benefits, Feb 28 coverage end)
2. `rsu-vesting-cliff-3-years` (equity, <3 years = forfeit all)
3. `stock-option-exercise-windows` (equity, next window or forfeit)
4. `personal-info-critical-for-equity` (administrative, update email ASAP)
5. `google-drive-ownership-transfer` (administrative, retrieve files)

**Link to:**
- March 10, 2026 temporal node
- OutSystems termination reply neuron
- Document file node (rawContentPath)

---

## Action Items For Paul

**Immediate (before losing access):**
- [ ] Submit any outstanding expense reports (manual sheet to people@outsystems.com)
- [ ] Download personal files from Google Drive
- [ ] Update personal email/phone/address in Workday
- [ ] Contact Shareworks if need equity login help (1-877-380-7793)
- [ ] Return equipment via shipping label

**Within 60 days:**
- [ ] Review COBRA enrollment letter from HealthEquity
- [ ] Decide on COBRA vs alternative health coverage

**Ongoing:**
- [ ] Monitor personal email for Shareworks exercise window notices
- [ ] Keep TriNet account info updated (tax docs, employment verification)

---

**Extracted:** March 10, 2026, 10:38 PM  
**From:** OutSystems Offboarding Guide PDF (692 KB)  
**Ready for:** Neurograph integration + email reply finalization
