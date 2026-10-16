# SF Matcha carousel exports

[Download the slides](https://sanfranciscomatcha.com/social/): **twelve carousel sets, 61 PNGs**. All are ready to export; none have been posted.

| Topic | Slides | Menu check |
|---|---:|---|
| Banana matcha | 5 | October 7, 2026 |
| Cold foam matcha | 5 | October 7, 2026 |
| Soy milk matcha | 5 | October 7, 2026 |
| Strawberry matcha | 5 | October 7, 2026 |
| Ceremonial and hand-whisked matcha | 5 | October 7, 2026 |
| Matcha under $7 | 5 | October 7, 2026 |
| Mission matcha | 7 | October 9, 2026 |
| Ube matcha | 6 | October 9, 2026 |
| Matcha and a laptop | 5 | October 13, 2026 |
| Pistachio matcha | 4 | October 14, 2026 |
| Black sesame matcha | 4 | October 15, 2026 |
| New SF matcha spots | 5 | October 16, 2026 |

These are rendered versions of twelve carousel drafts in the **48-draft** launch package. They do not add twelve more assets to that count. The companion captions, short posts and video scripts remain text drafts; no videos or published reach are claimed.

The October 12 refresh uses the concise published guide headlines and shorter copy. Original menu-check dates remain visible. Recheck menu links before posting, particularly seasonal drinks, launch-menu items and delivery prices.

## Rebuild

```sh
python3 scripts/render-social-assets.py
```

`content/social-launch.json` supplies every headline and body. The renderer supports different slide counts, refreshes those guide directories without deleting unrelated files, writes outputs atomically and fails if text cannot fit its safe area. A fixed Python, Pillow and font environment produces identical PNGs and manifests. The manifest records dimensions, byte counts, SHA-256 hashes, menu-check dates, source URLs and guide URLs.

## Content and visual checks

- 1080 × 1080 RGB PNGs; numeric filenames give slide order.
- The original 56 slides were visually checked in earlier releases; the newest five-slide recent-openings set was checked at full resolution. Headlines, body copy, date/source footers and guide links fit their allotted areas. Original 56 PNG bytes and earlier manifest receipts are unchanged.
- Text and simple geometric illustrations only; no invented café or drink photos.
- Every set has a closing guide link. No tasting ranking, quality award, partnership or approved discount is implied.
- Kumo's banana and London Fog drinks retain their dairy warnings. Binge's ube cold foam contains dairy even with a milk swap. Other undisclosed topping ingredients remain uncertain.
- Under-$7 prices exclude tax, tip and extras. Delivery prices can include markup; Le Mil's launch-menu affogato requires an availability check.
- The recent-openings set attributes Florecita's $8.75 to the October 2 report and Kiyomi's $9.75 to DoorDash; it does not turn delivery hours into walk-in hours or promise soy/dairy-free foam.

Upload each directory in numerical filename order with its companion caption. Put the guide URL in the platform's supported profile or story link where caption links are unavailable. Posting still requires a connected publishing destination and authorization.
