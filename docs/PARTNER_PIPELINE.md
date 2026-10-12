# SF Matcha partner pipeline

Last verified: October 12, 2026. Source: `content/partner-pipeline.json`.

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
| 3 | Best Boy Electric — Japantown | Ready for outreach; **not contacted** | [Official café account](https://www.instagram.com/bestboysf/) linked by [New People](https://www.newpeopleworld.com/best-boy-electric); public café phone on its ordering page | $1 off Matcha Latte or Black Sesame Matcha Latte at 1746 Post; proposed Oct 26–Dec 6; 100-redemption cap | Get explicit DM approval; recheck item availability and counter prices. |
| 4 | Constance Tea — Outer Richmond | Researched; **not contacted**; personalized email drafted | Official contact mailto on [constancetea.com](https://www.constancetea.com/) | Proposed $1 off a standard green-tea matcha latte at 3512 Balboa; reserve/black matcha/einspänner drinks excluded; illustrative Oct 26–Dec 6 | Verify exact current SKU and counter price from a readable merchant menu before marking ready for outreach. |

All four drafts propose no participation fee, a maximum $100 merchant-funded discount cost, one successful redemption per customer, a pause option and separation from editorial awards. Exact terms remain proposals.

## October 9 baseline evidence

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

## October 12 progress

- Pool expanded **2 → 4 independent cafés**: three ready for outreach and one researched with a complete draft but an unresolved menu check. No one was contacted; no merchant interest or agreement is recorded. No follow-up is due for these unsent prospects.
- **Best Boy Electric:** verified 1746 Post St, Mon–Fri 8am–3:30pm / weekends 9am–5pm, official @bestboysf route and public phone. [Current merchant ordering menu](https://best-boy-electric.square.site/) lists Matcha Latte **$6.50** and Black Sesame Matcha Latte **$7.50**. The $1 proposal would make base drinks $5.50/$6.50 before tax or surcharges, only if approved. The page marked all listed items unavailable when fetched; do not treat that as proof of closure or live stock. Recheck before any approved send. [August 2025 local reporting](https://newfillmore.com/2025/08/06/fillmore-is-getting-a-summer-spruce-up/) names operator Ryoji Taki. No café email was verified; same-name DJs and film-crew results were rejected. Do not use the landlord's separate inbox.
- **Constance:** verified 3512 Balboa St, current soft-opening hours and `infoconstancetea@gmail.com` from the official homepage/public app. [July 4 SF Standard reporting](https://sfstandard.com/2026/07/04/get-tea-drunk-san-francisco-s-first-freshly-milled-matcha-cafe/) identifies owner Bill Tiet and manager Ryan Tiet. Official metadata confirms matcha lattes, but the linked [menu image](https://matchatea.x02.me/i/ATQT.png) returned HTTP 403. Current SKU names, prices and milk choices remain unverified. [June 8 coverage](https://www.theinfatuation.com/san-francisco/reviews/constance-tea-and-matcha) distinguishes standard drinks from reserve options; that older report is context, not current price evidence. Keep this prospect researched until a readable merchant menu resolves the gap.
- **SŌHN enrichment:** its official Drink Menu link now targets [Letter_0120_1-1.pdf](https://www.sohnsf.com/s/Letter_0120_1-1.pdf). Downloaded, rendered and visually checked the image-only menu October 12. Matcha Latte remains **$6**; the matcha version of Banana Oat Milk Latte remains **$7**. Oat/almond substitutions are listed free; soy is not listed. Updated the ledger's primary menu links; no price-change claim.
- **California Kahve scope:** rechecked official contact, daily 9am–5pm park hours and the two always-on matcha names. Current prices remain unpublished. The planned Sutter storefront and Presidio truck are outside the Golden Gate Park proposal.
- New proposals use illustrative October 26–December 6 windows. Reset dates if approvals or service readiness slip. Prior October 19–November 29 proposals remain tentative; none activate automatically. Merchant-funded discount cost is capped at **$100 per proposal**; no participation fee or audience/traffic uplift promise. Milk surcharges, POS handling, availability, signing authority and all final terms require merchant review.
- Activation now explicitly requires a tested claim/redemption service in the ledger rules, alongside written merchant confirmation. `content/offers.json` stays empty; the live perks page has no café offers.

## Next actions

1. Recheck Constance's merchant menu to establish the standard green matcha SKU/price; do not borrow prices from unrelated businesses named Constance.
2. On explicit send approval, recheck the approved café's menu and use its verified contact route with the stored draft. No second message is due until an approved first message has actually been sent.
3. After a merchant responds, confirm the exact location, drinks, prices, dates, funding, exclusions, staff process and cap in writing. Keep public offers inactive until the tested claim/redemption service is also ready.
