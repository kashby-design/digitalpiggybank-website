# Content brief: "Best allowance apps for kids in 2026" comparison page

> **Note:** A version of this page already exists at [/vs/allowance-apps](../../src/pages/vs/allowance-apps.astro) as part of Phase 4. This brief expands the same concept into a longer SEO-optimized companion post, plus suggests an updated approach for the existing landing page.

## Target keyword
- **Primary:** best allowance apps for kids
- **Secondary:** kids allowance app comparison, Greenlight vs GoHenry, allowance tracker app, kids money app no debit card
- **Search intent:** Commercial / comparison. Parents are 1–2 weeks from picking an app.

## Goal
Rank in the top 5 for "best kids allowance app" and "[competitor] vs [competitor]" queries while honestly defending the DPB price + no-card angle.

## Audience
Parents of kids 6–14 who have decided they want a money-tracking tool but haven't picked one yet. Already past "why teach kids money" — now in "which one."

## Format
- **Type:** Blog post (companion to the existing landing page at /vs/allowance-apps).
- **Length:** 2,000–2,500 words. Long-form, evergreen, updated yearly.
- **Slug:** `best-allowance-apps-for-kids-2026`
- **Image:** Hero showing 3-4 app icons side-by-side, or a comparison-table illustration.

## Outline

1. **Lede (150 words)** — Open with the buying decision: "five apps, five different price tags, five different philosophies. Here's how to pick."
2. **Quick-pick summary (200 words)** — TL;DR table: "Pick X if you want Y" for each of 5 apps. Mirror the structure of the /vs/allowance-apps landing page.
3. **Detailed reviews (250 words each)** — One section per app: Greenlight, GoHenry, BusyKid, FamZoo, Digital Piggy Bank. Each section covers price, what it's best at, real downsides, who it's wrong for.
4. **Side-by-side comparison table** — Reuse the [ComparisonTable component](../../src/components/ComparisonTable.astro) or embed an HTML table mirroring the landing page.
5. **Buying decision framework (300 words)** — Three questions: (1) Do you want a real card, or just tracking? (2) Are you okay paying per kid? (3) Will you use investing features? Each question routes to 1–2 apps.
6. **Honest take on Digital Piggy Bank (200 words)** — Be explicit about who it's wrong for (teens, kids who need card practice, families who want investing).
7. **FAQ block (150 words)** — Schema-ready Q&A: "What's the cheapest?" "Which has the best chore tracking?" "Which is best for one kid vs many?"
8. **Closing + CTA (100 words)** — Soft CTA to /pricing or /features.

## Internal links to add (target ≥8)
- Link to /vs/allowance-apps (the landing version)
- Link to /pricing
- Link to /features
- Link to [/blog/cash-vs-digital-vs-debit-for-kids](../../src/content/blog/cash-vs-digital-vs-debit-for-kids.md)
- Link to [/blog/save-spend-give-jars-for-kids](../../src/content/blog/save-spend-give-jars-for-kids.md)
- Link to [/blog/digital-money](../../src/content/blog/digital-money.md)
- Link to [/blog/pay-for-allowance](../../src/content/blog/pay-for-allowance.md)
- Link to [/guides/allowance-and-chores-by-age](../../src/pages/guides/allowance-and-chores-by-age.astro)

## Schema to emit
- `Article` (auto via blog post layout)
- `FAQPage` for the FAQ block — add a JSON-LD script in the post or via a wrapper component
- Optionally `ItemList` listing the apps reviewed

## Tags
`allowance`, `digital-money`

## Success metrics
- **6-month goal:** rank top 10 for "best allowance apps for kids"
- **12-month goal:** rank top 3 for at least one "X vs Y" query (likely Greenlight vs GoHenry or vs BusyKid)
- **Leading indicator:** ≥ 2 backlinks from parenting blogs within 90 days of publish

## Risk / honesty notes
- **Don't lie about competitors.** Every claim should be verifiable on the competitor's site at time of publish. Date-stamp the post and update annually.
- **Disclose the conflict.** First paragraph should say "Digital Piggy Bank is our product — here's how we'll try to make this honest anyway."
- **Don't paywall the recommendation.** If Greenlight is genuinely the right pick for some readers, say so. Recommending DPB to everyone destroys the credibility of the whole post.
