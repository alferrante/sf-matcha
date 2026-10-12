# Editorial check — October 12, 2026

Two compact menu guides were added to `content/guides.json`. The original ten guide records and their check dates remain unchanged. Publication and generated files belong to the sprint publisher.

## Coconut water matcha

Route: `/guides/coconut-water-matcha-san-francisco/`

| Café | Verified order and price | Address and schedule | Milk evidence |
| --- | --- | --- | --- |
| Bageletto | Coconut Cloud Matcha, $8 | 76 14th St; pickup Mon–Fri 7:15am–1:45pm, Sat–Sun 8:15am–2:45pm | Coconut water with whipped matcha foam. The item panel lists an oat option +$1; soy is not listed. It does not explicitly confirm a dairy-free foam recipe. |
| Kiss of Matcha — Clement | Matcha Cloud Coconut, $7.47 | 750 Clement St; Tue–Thu 10am–8pm, Fri–Sat 10am–10pm, Sun 10am–9pm; Monday closed | Product describes matcha cream and coconut water. Full cream ingredients and soy options are not disclosed. |
| Origin Lab | Coconut Wave Matcha Cloud, $7.75 | 211 Sutter St; official website says daily 6am–8pm | Official website explicitly says cloud foam contains dairy and honey. Soy is listed for lattes, but the coconut item panel does not offer a replacement cloud. |

Sources, freshly opened October 12:

- [Bageletto item, price and oat option](https://bageletto.com/order/bageletto-14th/item-coconut-cloud-matcha_abf996bf-b849-4090-af66-3cd16a8dc0d1)
- [Bageletto full pickup schedule](https://toast.app/r/bageletto-14th/order)
- [Kiss of Matcha coconut item](https://kissofmatcha.order.tryperdiem.com/products/matcha-cloud-coconut)
- [Clement location and local item listing](https://kissofmatcha.order.tryperdiem.com/locations/san-francisco-clement)
- [Origin Lab item and current price](https://originlabcoffeematcha.toast.site/order/origin-lab-matcha-cafe-211-sutter-st/item-coconut-wave-matcha-cloud_f6e0d614-aaf2-460f-9405-d0f1fa710b4c)
- [Origin Lab foam ingredients and website hours](https://originlabcoffee.com/)

The Clement page's embedded `OpeningHoursSpecification` and weekly-hours data agree on the six-day schedule; its fresh visible Monday state says closed. The older directory record's hours differ, so this guide uses the freshly checked local menu page rather than repeating old directory hours. Origin Lab's ordering portal shows a later closing time than its website; the guide attributes 6am–8pm to the official website and notes the difference. Bageletto's pickup window ends before the storefront's visible closing time; the guide explicitly labels these as pickup hours.

## Matcha without milk

Route: `/guides/matcha-without-milk-san-francisco/`

| Café | Verified order and price | Address and schedule | Recipe evidence |
| --- | --- | --- | --- |
| Stonemill Matcha | Hot Matchacano, $5.75 | 561 Valencia St; Mon–Fri 10am–4pm, Sat–Sun 9am–7pm | Official item says matcha and hot water, unsweetened. |
| Best Boy Electric | Matcha Americano, $6 | 1746 Post St; host posts Mon–Fri 8am–3:30pm, Sat–Sun 9am–5pm | Official item says hot or iced water. Every item currently shows unavailable for online ordering; the guide asks readers to confirm at the counter. |
| Bageletto | Matcha Tea (no milk), $6 | 76 14th St; pickup Mon–Fri 7:15am–1:45pm, Sat–Sun 8:15am–2:45pm | Item name explicitly specifies no milk; detailed recipe and sweetener are not published. |

Sources, freshly opened October 12:

- [Stonemill Matchacano item and price](https://toast.app/r/stonemill-matcha/order/item-to-hot-matchacano_f0ff8882-9b39-41b8-b6d4-7c57757cdbb6)
- [Stonemill official recipes](https://www.stonemillmatcha-us.com/menu)
- [Stonemill café hours](https://www.stonemillmatcha-us.com/)
- [Best Boy official menu, address and price](https://best-boy-electric.square.site/)
- [Best Boy café hours from NEW PEOPLE](https://www.newpeopleworld.com/best-boy-electric)
- [Bageletto plain-matcha item](https://bageletto.com/order/bageletto-14th/item-matcha-tea-no-milk_f30ec349-6f30-4c3c-86ac-d93df0852611)
- [Bageletto pickup schedule](https://toast.app/r/bageletto-14th/order)

Stonemill's online pickup closes earlier than its café; the public entry preserves that distinction. These are documented no-milk orders, not allergy or shared-preparation certifications. Soy is not necessary for these plain-water orders; Best Boy's current ordering menu does not name its milk substitutions. No tasting judgments, sugar measurements, rankings or awards are asserted.

## Research holds

- A black-sesame matcha guide was researched but not added: Best Boy and Binge have clear official listings, but a third mapped operating café was not verified from a current primary menu. Ceré's current SF menu lists black-sesame **hojicha**, which must not be silently relabeled matcha. Stonemill's black-sesame latte similarly does not document matcha in its recipe.
- Ceré's Coco Cream Matcha was found on its SF merchant menu but was unnecessary once three cafés had direct official item evidence. Its delivery description carries a platform warning about potentially generated descriptions, so it was not used for ingredient claims.
- Four Chairs' currently linked PDF did not document a coconut-cloud order. No inclusion was inferred from the older directory note.
- All six entries use existing operating directory IDs. No excluded café or planned location is included. No new merchant participation or offer is implied.

## Local validation

`validateGuides` passed for all 12 guides against the current 94-shop source. All six added entries have explicit prices, primary source links, compact layout, and material milk/availability notes. The sprint publisher runs the full build, tests, customer-copy audit, commit and live verification.
