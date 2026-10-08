# Editorial verification — October 8, 2026

Added two neighborhood guides to `content/guides.json`, each with three existing directory venues. There are now eight guides and 27 total venue entries. Lists compare documented menu styles; they contain no tasting rankings or firsthand tasting claims.

## Japantown

| Venue | Verified menu evidence | Address | Price and milk evidence | Hours source |
| --- | --- | --- | --- | --- |
| Best Boy Electric | Hand-whisked unsweetened Matcha Latte, usucha, Matcha Americano | 1746 Post St | Latte $6.50; usucha and americano $6. Public menu does not name plant-milk choices. | NEW PEOPLE: Mon–Fri 8am–3:30pm; Sat–Sun 9am–5pm. |
| YakiniQ | Matcha Latte; banana, strawberry, red bean and lavender matcha | 1640 Post St, FL 1 | Classic from $7; iced banana $8.50. Classic panel lists “Extra” oat, almond and soy +$0.75; article asks readers to confirm replacement rather than addition. | Merchant Toast: Tue–Sat 11am–5pm; Sun/Mon closed. |
| Matcha Cafe Maiko | Brand menu includes Matcha Latte, matcha soft serve, parfaits and floats | Official SF page: 1581 Webster St, Suite 175 | Current official brand menu does not list local prices, substitutions or full allergens. | Official SF page says call 415-757-0919 for updated hours. |

Sources:

- https://best-boy-electric.square.site/
- https://www.newpeopleworld.com/best-boy-electric
- https://toast.app/r/yakiniq-cafe-1640-post-street-fl-1/order
- https://toast.app/r/yakiniq-cafe-1640-post-street-fl-1/order/item-matcha-latte_32d7f96b-093a-4e9e-aafa-c78e5fcc1b90
- https://www.matchacafe-maiko.com/eng/store/index.html?country=usa&region=ca&target=ca-sanfran
- https://www.matchacafe-maiko.com/eng/menu/

Maiko’s menu explicitly warns that items vary by location. The article preserves that limitation rather than asserting every dessert is in stock in Japantown. Best Boy’s menu showed drinks unavailable for online ordering during verification; the article reports that without claiming the café is closed. NEW PEOPLE is the host venue and links Best Boy’s official account.

## Richmond District

| Venue | Verified menu evidence | Address | Price and milk evidence | Hours source |
| --- | --- | --- | --- | --- |
| Kiss of Matcha — Clement | Hand-whisked latte; six grams of matcha; optional dairy matcha cream | 750 Clement St | Latte $7.47 on current merchant ordering page. “Choice of milk” appears without named alternatives. | Published location JSON-LD: Tue–Thu 10am–8pm, Fri/Sat 10am–10pm, Sun 10am–9pm; no Monday entry. |
| Pixlcat | Unsweetened organic ceremonial Uji latte; strawberry, guava and banana bread options; matcha mochi | 519 Clement St | Classic $7; strawberry $8.50. Classic item panel lists oat and almond (+$1); soy absent. Dopo Panna includes whipped cream. | Official website: Mon–Fri 7am–4pm; Sat/Sun 7am–5pm. |
| Constance | Official website identifies freshly milled matcha and matcha lattes; visible page describes in-house stone milling of tencha | 3512 Balboa St | No prices, named milks or full ingredients on current official website. Article keeps these unconfirmed. | Visible official page: soft-opening Mon/Wed/Thu 10am–5pm, Fri–Sun 10am–6pm; Tue closed. |

Sources:

- https://kissofmatcha.order.tryperdiem.com/products/matcha-latte
- https://kissofmatcha.order.tryperdiem.com/locations/san-francisco-clement
- https://kissofmatcha.order.tryperdiem.com/menu/matcha-latte
- https://order.toasttab.com/online/pixlcat-coffee-519-clement-st
- https://order.toasttab.com/online/pixlcat-coffee-519-clement-st/item-matcha-latte_f76b3ffb-006b-409b-8792-8c83357e48ba
- https://www.pixlcatcoffee.com/order-now
- https://www.constancetea.com/

Constance’s client-rendered visible hours were verified in its public page bundle `/assets/index-ihhm9QS5.js`; matcha latte evidence also appears in its official HTML description. No more detailed drink recipe or latte price was recovered. Kiss of Matcha’s menu prices are ordering-channel prices; the article does not claim identical counter prices.

## Publication checks and handoff

- Ran `buildGuides` into a temporary directory: all eight guides passed the existing schema and venue-ID validation; 16 output files generated successfully.
- Only `content/guides.json` and this verification note changed in this task.
- Parent publisher should reconcile directory hours for Best Boy and Constance, plus Kiss of Matcha Clement’s Sunday closing time. The renderer currently displays directory hours alongside article availability, which would otherwise expose contradictory times.
- The original social-launch tests assume four text drafts for every guide. The two new guides require either their own drafts or an explicit initial-launch coverage scope in that test.
