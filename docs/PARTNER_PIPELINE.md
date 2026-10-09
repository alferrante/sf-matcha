# SF Matcha partner pipeline

Last verified: October 9, 2026. Source: `content/partner-pipeline.json`.

This is a research and drafting ledger. No outreach has been sent, no café has agreed to participate, and no offer is active. An offer advances to `confirmed` only after written approval from an authorized merchant representative; publication also requires a working claim/redemption service.

## Stage definitions

| Stage | Meaning |
| --- | --- |
| `candidate` | Possible fit; identity and current matcha program still need verification. |
| `researched` | Address, independence, current menu and at least one public contact route are verified. |
| `ready_for_outreach` | Personalized draft and location-specific proposed terms are complete; nothing has been sent. |
| `contacted` | Outreach was sent after explicit authorization. |
| `interested` | Merchant has replied positively without agreeing final terms. |
| `negotiating` | Drinks, dates, cap, funding, POS process or exclusions are under review. |
| `confirmed` | Authorized merchant has approved final terms in writing. This still does not prove the offer is live. |
| `paused` | Work is intentionally on hold or an approved offer is temporarily unavailable. |
| `declined` | Merchant declined; do not re-contact without a new reason and approval. |

## Current qualified pool

| Priority | Prospect | Stage | Verified public route | Proposed location offer | Next action |
| ---: | --- | --- | --- | --- | --- |
| 1 | SŌHN — Dogpatch | Ready for outreach; **not contacted** | Official general inbox on [sohnsf.com](https://www.sohnsf.com/) | $1 off Matcha Latte or Banana Oat Milk Matcha; Oct 19–Nov 29; 100-redemption cap; base drinks only | Get Angela’s explicit send approval; recheck the official drink menu immediately before sending. |
| 2 | California Kahve — Golden Gate Park | Ready for outreach; **not contacted** | Official email and form on its [contact page](https://www.californiakahve.com/contact) | $1 off Matcha Latte or Lavender Mint Matcha; Oct 19–Nov 29; 100-redemption cap; seasonal drinks excluded unless added in writing | Get Angela’s explicit send approval; merchant must confirm current counter prices and POS handling. |

Both drafts propose no participation fee, a maximum $100 merchant-funded discount cost, one successful redemption per customer, a pause option and separation from editorial awards. Exact terms remain proposals.

## Evidence changes captured today

- SŌHN’s official site lists 2535 3rd St, Tue–Sun 9am–4pm, Monday closed, and a public general inbox. Its current linked beverage menu lists Matcha Latte at $6 and Banana Oat Milk Matcha at $7.
- California Kahve’s official contact page publishes its Golden Gate Park address and public inbox. Its official locations page now says the café is open daily 9am–5pm; the directory previously said Tuesday–Sunday, so the source listing was corrected. Its official menu names Matcha Latte and Lavender Mint Matcha as always-on items but publishes no prices.

## Duplicate and safety rules

- Match by directory `shopId`, normalized business name, address and the aliases in `noDuplicates` before adding a lead.
- Treat multi-location businesses by exact location. Never imply a location participates because another location does.
- Keep Little Sweet, Avotoasty and Haraz Coffee House out of automated prospecting unless Angela reverses the standing exclusion.
- Never advance a prospect to `contacted` without explicit authorization, or to `confirmed` without written merchant approval.
- Never put private correspondence, non-public contact data, staff credentials or signed agreements in this public repository.

## Unsent outreach

The complete, personalized drafts and proposed terms are stored in `content/partner-pipeline.json`. They are preparation only. No email, DM or form submission was made on October 9.
