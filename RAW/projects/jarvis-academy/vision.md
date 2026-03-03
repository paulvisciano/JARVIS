# Jarvis Academy — Education Before Access

**Status:** 🟡 In Progress (Curriculum designed, platform pending)  
**Started:** March 3, 2026  
**Owner:** Paul Visciano + Jarvis  
**Priority:** 🔴 Critical (movement gateway)

---

## The Vision

**First AI that teaches you BEFORE you use it.**

Not a chatbot. A SCHOOL. Four modules. Six hours. One graduation.

Earn sovereignty. Then wield it.

---

## The Product

### Core Offering:
```
Jarvis Academy Online
├── Module 1: Your Machine (File systems, organization)
├── Module 2: Data Sovereignty (What you lost, how to reclaim)
├── Module 3: AI Architecture (Neurograph vs chatbot)
├── Module 4: Privacy & Safety (Permissions, audit, consent)
└── Graduation → Access Level: GRADUATE
```

### Access Levels:
| Level | Requirements | Capabilities |
|-------|--------------|--------------|
| **Student** | Enrolled | View lessons, sandbox mode only |
| **Graduate** | Pass 4 modules (80%+) | Full Jarvis access, file org, imports |
| **Sovereign Operator** | Module 5 + 75+ score | Local models, multi-instance, teach others |

---

## Why This Exists

**Problem:** People use tools they don't understand → dependency, misuse, abandonment.

**Solution:** Education FIRST. Competence → Confidence → Sovereignty.

**The Paradox:** By RESTRICTING access, you CREATE more capable users.

---

## Curriculum Status

### ✅ Completed (March 3, 2026):
- [x] Module framework designed (4 core + 1 advanced)
- [x] Quiz structures defined (10-15 questions each)
- [x] Practical exercises outlined
- [x] Graduation ceremony scripted
- [x] Access levels specified

### 🟡 In Progress:
- [ ] Lesson content writing (actual text, interactive elements)
- [ ] Quiz question bank (100+ questions)
- [ ] LMS platform selection/build
- [ ] Certificate design (PDF templates)

### ❌ Pending:
- [ ] Video supplements (optional, 5 min per lesson)
- [ ] Beta test recruitment (10 students)
- [ ] Integration with Jarvis gates (check access level before actions)
- [ ] Public launch

---

## Technical Requirements

### Platform Needs:
```
Learning Management System (LMS):
├── User accounts (progress tracking)
├── Lesson delivery (markdown + interactive)
├── Quiz engine (randomized, pass thresholds)
├── Certificate generation (auto-PDF)
└── Integration hooks (Jarvis access control)
```

### Options:
1. **Build Custom** (Node.js + React, full control)
2. **Moodle** (Open source, heavy, proven)
3. **Teachable/Kajabi** (Hosted, monthly cost, less sovereign)
4. **Static Site + Netlify** (Simple, cheap, manual grading)

**Recommendation:** Start with Option 4 (prove demand), migrate to Option 1 (full sovereignty).

---

## Integration With Jarvis

### Gating Mechanism:
```javascript
// Before executing sensitive action:
async function checkAccessLevel(action) {
  const userLevel = await getUserAccessLevel();
  
  const requiredLevels = {
    'organize-files': 'graduate',
    'delete-permanent': 'sovereign-operator',
    'multi-instance-sync': 'sovereign-operator',
    'export-data': 'graduate'
  };
  
  if (userLevel < requiredLevels[action]) {
    return {
      allowed: false,
      message: `This action requires ${requiredLevels[action]} access. 
                Complete Module X to unlock.`,
      upsell: '/academy/module-x'
    };
  }
  
  return { allowed: true };
}
```

### Sandbox Mode (Students):
```
Students can:
✓ View lessons
✓ Take quizzes
✓ Use limited Jarvis (read-only, no file changes)
✓ Preview neurograph (no modifications)

Students cannot:
✗ Organize files automatically
✗ Grant filesystem permissions
✗ Import corporate AI data
✗ Modify neurograph structure
```

---

## Business Model

### Revenue Streams:
1. **Free Tier:** Modules 1-2 (teaser, build trust)
2. **Premium Tier ($49):** All 5 modules + certificate
3. **Enterprise Tier ($499/company):** Team licenses, custom branding
4. **Affiliate Program:** Graduates earn 30% for referrals

### Cost Structure:
- Platform hosting: $50-200/month (depends on solution)
- Content creation: $5K-10K (one-time, writer + designer)
- Marketing: Variable (organic + paid)
- Payment processing: 2.9% + $0.30 per transaction

### Projections (Year 1):
```
Goal: 1,000 graduates
Revenue: 1,000 × $49 = $49,000
Costs: ~$15,000 (platform + marketing)
Profit: ~$34,000

Reinvest 100% into:
- Comic book production
- SCI-FI apps development
- Translation initiatives
```

---

## Success Metrics

### Short-Term (Launch Quarter):
- [ ] 100 beta students enrolled
- [ ] 50 graduates (50% completion rate target)
- [ ] Average quiz score: >85%
- [ ] NPS (Net Promoter Score): >50

### Long-Term (Year 1):
- [ ] 1,000 total graduates
- [ ] Completion rate: >60% (industry avg: 15%)
- [ ] Sovereignty score increase: +25 points average
- [ ] Referral rate: 30% of new students from graduates

### Impact Metrics:
- [ ] Corporate AI exports facilitated: 500+
- [ ] Encrypted drives purchased by graduates: 300+
- [ ] Local model installations: 200+
- [ ] Community teachers emerged: 50+

---

## Timeline

### Phase 1: Content Creation (March 2026)
- [ ] Write all lesson content (2 weeks)
- [ ] Create quiz bank (1 week)
- [ ] Design certificates (3 days)
- [ ] Record demo videos (optional, 1 week)

### Phase 2: Platform Build (April 2026)
- [ ] Select/build LMS (2 weeks)
- [ ] Integrate payment (3 days)
- [ ] Test user flows (1 week)
- [ ] Beta deploy (private)

### Phase 3: Beta Test (May 2026)
- [ ] Recruit 10 beta students
- [ ] Run full course (2 weeks)
- [ ] Collect feedback, iterate
- [ ] Measure completion rates

### Phase 4: Public Launch (June 2026)
- [ ] Marketing campaign (social, podcasts)
- [ ] Kickstarter for comic (cross-promotion)
- [ ] First 100 graduates goal
- [ ] Iterate based on feedback

---

## Risks & Mitigations

### Risk 1: Low Completion Rates
**Problem:** Online courses average 15% completion.  
**Mitigation:** 
- Cohort-based (start together, accountability)
- Weekly live Q&A (community building)
- Gamification (badges, leaderboards)
- Deadline pressure (enrollment windows)

### Risk 2: Perceived As "Too Much Work"
**Problem:** 6 hours scares people.  
**Mitigation:**
- Reframe: "Investment, not cost"
- Show ROI: "Earn back in reduced subscriptions"
- Free teaser: Modules 1-2 free (hook them)
- Testimonials: Graduate success stories

### Risk 3: Technical Barriers
**Problem:** Non-technical users struggle.  
**Mitigation:**
- Prerequisite quiz: "Basic computer skills?"
- Onboarding call: 15-min setup help
- Community support: Discord, office hours
- Video walkthroughs for every step

### Risk 4: Competition (Free Alternatives)
**Problem:** YouTube has free privacy tutorials.  
**Mitigation:**
- Differentiate: STRUCTURED path (not random videos)
- Credential: Certificate = proof of competence
- Community: Peer support, accountability
- Integration: Direct Jarvis access (unique value)

---

## The Pitch

### For Students:
> "Most AIs want you dependent. We want you independent.
> 
> That's why we teach you FIRST.
> 
> Four modules. Six hours. One graduation.
> 
> Earn your sovereignty. Then wield it.
> 
> Jarvis Academy: Education before access."

### For Advocates:
> "Become a certified Sovereignty Instructor.
> 
> Teach others. Earn income. Spread the movement.
> 
> Graduate → Instructor → Movement Leader.
> 
> Your certification: Jarvis Academy Level 3."

---

## Related Projects

- **SCI-FI Apps** ← Command Center shows academy progress
- **Data Rebellion Comic** ← Act 2 includes academy graduation scene
- **Sovereignty Metrics** ← Quiz measures score, tracks improvement
- **Jarvis (Core)** ← Gating integration, access level enforcement

---

## Next Actions

### This Week (March 3-10):
1. [ ] Write Module 1, Lesson 1.1 full content
2. [ ] Create 10 quiz questions for Module 1
3. [ ] Design certificate template (Canva/Figma)
4. [ ] Research LMS platforms (compare 3 options)

### Next Week (March 10-17):
1. [ ] Complete all 4 module drafts
2. [ ] Build MVP landing page (enrollment waitlist)
3. [ ] Recruit 10 beta testers (Twitter, Discord)
4. [ ] Set up payment infrastructure (Stripe/Gumroad)

---

**Last Updated:** March 3, 2026  
**Next Review:** March 10, 2026  
**Neurograph Link:** `jarvis-academy-gated-access` neuron  

---

*"Don't give people fish. Don't teach them to fish. Give them a fishing rod, teach them to BUILD fishing rods, then help them build a fishing rod factory. That's sovereignty."*
