# Optimized titles + meta descriptions — all 12 existing blog posts

Rewrites for every blog post in `src/content/blog/`. The two already-applied rewrites (Phase 1) are at the top so you can see what's live vs. proposed.

**How to use:** Open each post's frontmatter and replace the `title` and `description` fields with the "Proposed" values below. Brand suffix handling in [src/pages/blog/[...slug].astro](../../src/pages/blog/[...slug].astro:17) automatically trims " | Digital Piggy Bank" when total length would exceed 60 chars, so write titles ≤ 45 chars where possible.

Constraints:
- **Title (in frontmatter):** ≤ 60 chars (45 ideal so brand suffix fits).
- **Description:** 130–160 chars, full sentence, leads with the benefit/hook, includes the primary keyword naturally.

---

## Already applied (Phase 1)

### digital-money.md ✅
- **Title (unchanged, 78 chars — too long):** "When Money Is Invisible: How to Teach 11 and 12 Year Olds About Digital Payments"
- **Description (rewritten Phase 1):** "When money lives on a screen, kids stop seeing what it costs. Here's how to teach 11- and 12-year-olds the real value of digital payments." (142 chars) ✅
- **Recommended title shortening for Phase 5:** "When Money Is Invisible: Teaching Tweens Digital Cash" (53 chars)

### help-your-kid-see-through-ads.md ✅
- **Title (unchanged, 62 chars — over limit):** "How to Help Your Kid See Through Ads and Stop Impulse Buying"
- **Description (rewritten Phase 1):** "Your kid sees a million ads before age 21. Here's how to teach them to spot the pitch — and pause before the impulse buy." (124 chars) ✅
- **Recommended title shortening for Phase 5:** "Help Your Kid See Through Ads (and Skip Impulse Buys)" (53 chars)

---

## Proposed (Phase 5 — not yet applied)

### best-age-start-chores.md
- **Current title:** "Best Age to Start Chores: An Age-by-Age Guide" (44 chars, fine)
- **Current description:** "When should kids start doing chores? A practical, age-by-age guide from toddler to age 12, plus what to pay (or not) and how to make chores stick." (146 chars, fine)
- **Verdict:** Already strong after Phase 5 expansion. No change needed.

### chores-for-cash.md
- **Current title:** "Chores for Cash" (15 chars)
- **Current description:** "Should you pay kids for chores? Explore the pros, cons, and best approaches to connecting household responsibilities with allowance."
- **Proposed title:** "Chores for Cash: A Smart Allowance Guide for Kids" (49 chars)
- **Proposed description:** "Should you pay kids for chores? A practical breakdown of which tasks earn money, which don't, and how to set up a system that actually works." (143 chars)
- **Why:** Adds the primary keyword ("allowance guide") to the title; description leads with the question parents are searching.

### daily-money-habits.md
- **Current title:** "Daily Money Habits That Build Lifelong Savers" (46 chars)
- **Current description:** "Small daily money habits do more for your tween than the big money talk. Here's what habit and self-control research says about ages 11 to 12." (143 chars)
- **Verdict:** Strong. No change.

### how-delayed-gratification-helps-kids-save-smarter.md
- **Current title:** "How Delayed Gratification Helps Kids Save Smarter" (50 chars — title-only)
- **Current description:** "Learn how the famous marshmallow test reveals the power of teaching kids to wait—and how you can use it to build smarter saving habits at home." (144 chars)
- **Proposed title:** "Delayed Gratification: How the Marshmallow Test Helps Kids Save" (63 chars — title-only, brand suffix trimmed)
- **Verdict:** Optionally tighten title to include "marshmallow" for the search term. Description is strong.

### kids-watching-your-wallet.md
- **Current title:** "Your Kids Are Watching Your Wallet (But Not in the Way You Think)" (66 chars — over)
- **Current description:** "New research says your kid's money personality may not be a copy of yours. Here's how to coach the brain they were born with." (125 chars)
- **Proposed title:** "Your Kids Are Watching Your Wallet (But Not Like You Think)" (60 chars)
- **Proposed description:** "Your kid's money personality may not copy yours — research shows it's pre-wired. Here's how to coach the brain they were born with." (132 chars)
- **Why:** Trims title to 60 chars; description leads with the surprise insight.
- **Also:** Remove the `primeryKeywords` and `SecondaryKeywords` fields from frontmatter (typo + unused).

### moms-are-money-teachers.md
- **Current title:** "Moms Are the First Money Teachers. Here's How to Make It Count." (64 chars — over)
- **Current description:** "81% of moms teach kids basic money skills. Here's how to turn everyday moments into money lessons that actually stick, plus 4 easy ways to start this Mother's Day." (164 chars — over)
- **Proposed title:** "Moms Are the First Money Teachers — Here's How to Lead" (54 chars)
- **Proposed description:** "81% of moms already teach kids basic money skills. Here's how to turn everyday moments into lessons that stick — plus 4 ways to start today." (140 chars)
- **Why:** Both fields are over limit. Title tightened; description hits 140 with the stat lead intact.

### no-free-lunch.md
- **Current title:** "No Free Lunch: How Chore Earnings Teach Kids the Real Value of Money" (70 chars — over)
- **Current description:** "Paying kids for chores teaches money's true value better than a free allowance. Here's what 50 years of research says about chore based pay for ages 8 to 10." (158 chars, fine)
- **Proposed title:** "No Free Lunch: Why Chore Earnings Teach Kids Real Value" (55 chars)
- **Verdict:** Description fine. Title needs trim.

### pay-for-allowance.md
- **Current title:** "How Much Allowance Should You Give Your Child?" (47 chars)
- **Current description:** "A practical guide to deciding how much allowance to give your child, with age-based recommendations and tips for making it work." (129 chars)
- **Proposed description:** "How much allowance is reasonable in 2026? Age-by-age recommendations, the $1-per-year rule, and how to make it stick — from a parent who's tested it." (149 chars)
- **Why:** Adds the current year + specifies the well-known rule for SERP visibility.

### piggy-banks-to-goals-simple-saving-tips-for-kids.md
- **Current title:** "Piggy Banks to Goals: Simple Saving Tips for Kids" (50 chars)
- **Current description:** "Practical tips and strategies to help kids ages 5-12 learn to save money, set goals, and build smart financial habits." (118 chars)
- **Proposed description:** "How to help kids ages 5–12 stop dumping the piggy bank and start hitting real savings goals. Tactics that work without lectures." (128 chars)
- **Why:** Description was a bit generic. New version is concrete and ties to the title's "goals" hook.

### weekly-vs-gig-allowance.md
- **Current title:** "Weekly Allowance vs Gig Allowance?" (35 chars)
- **Current description:** "Should you give your child a weekly allowance or pay per task? Compare both approaches and find what works best for your family." (129 chars)
- **Proposed title:** "Weekly Allowance vs Pay-Per-Chore: Which Works?" (47 chars)
- **Proposed description:** "Should you pay your kid weekly or per chore? A side-by-side comparison with the pros, cons, and the hybrid model most families actually settle on." (148 chars)
- **Why:** "Pay-per-chore" matches search behavior better than "gig." Description adds the hybrid hook.

---

## Summary table

| Slug | Title status | Description status |
|---|---|---|
| best-age-start-chores | ✅ keep (Phase 5 already retitled) | ✅ keep |
| chores-for-cash | 🟡 rewrite | 🟡 rewrite |
| daily-money-habits | ✅ keep | ✅ keep |
| digital-money | 🟡 shorten title | ✅ Phase 1 |
| help-your-kid-see-through-ads | 🟡 shorten title | ✅ Phase 1 |
| how-delayed-gratification-helps-kids-save-smarter | 🟡 optional tighten | ✅ keep |
| kids-watching-your-wallet | 🟡 trim to 60 | 🟡 sharpen lead |
| moms-are-money-teachers | 🟡 rewrite | 🟡 trim to 140 |
| no-free-lunch | 🟡 trim title | ✅ keep |
| pay-for-allowance | ✅ keep | 🟡 add year + rule |
| piggy-banks-to-goals-simple-saving-tips-for-kids | ✅ keep | 🟡 sharpen |
| weekly-vs-gig-allowance | 🟡 rewrite | 🟡 rewrite |

8 titles and 8 descriptions to update across the remaining 10 posts. Apply via simple frontmatter edits; no code changes needed.
