(() => {
  // content/guides.json
  var guides_default = [
    {
      slug: "banana-matcha-san-francisco",
      title: "Where to Get Banana Matcha in San Francisco",
      description: "Three SF banana matcha drinks, from oat-milk lattes to seasonal injeolmi foam, with menu prices and milk notes.",
      emoji: "🍌",
      updatedAt: "2026-10-07",
      intro: "Banana matcha comes in a few different forms: banana in the milk, banana in the drink, or banana underneath a cloud of cream. These three San Francisco menus give you distinct versions to try. SŌHN has the oat-milk version, YakiniQ lists a straightforward iced banana matcha, and Kumo has a seasonal banana-and-kinako build. Pick by ingredients and neighborhood before deciding which one is your favorite.",
      methodology: "We checked café menus on October 7, 2026. This is an unranked guide to documented drinks, not a tasting-based “best” list. Prices are listed menu prices before tax and extras; a menu listing does not guarantee stock.",
      entries: [
        {
          shopId: "sohn",
          drink: "Banana Oat Milk Latte with Matcha",
          verdict: "For banana oat milk without a cream-top order.",
          details: "SŌHN lists matcha as one of the tea or coffee choices for its iced banana oat milk latte. Go to 2535 3rd St in Dogpatch.",
          milkNote: "Oat milk is named in this drink; soy is not listed. Confirm any additional ingredients if you avoid dairy.",
          price: "$7",
          availability: "Tue–Sun 9am–4pm; closed Monday.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.sohnsf.com/s/Letter_0120_1-1.pdf"
            },
            {
              label: "Location and hours",
              url: "https://www.sohnsf.com/"
            }
          ]
        },
        {
          shopId: "yakiniq-cafe",
          drink: "Iced Banana Matcha Latte",
          verdict: "A banana matcha stop in Japantown.",
          details: "The menu lists a 16-ounce iced banana matcha. Find it at 1640 Post St, first floor.",
          milkNote: "The banana drink does not show a plant-milk substitution; ask before assuming it can be dairy-free.",
          price: "$8.50",
          availability: "Tue–Sat 11am–5pm; closed Sunday and Monday.",
          sources: [
            {
              label: "Official menu",
              url: "https://toast.app/r/yakiniq-cafe-1640-post-street-fl-1/order"
            }
          ]
        },
        {
          shopId: "kumo-matcha-divisadero-market",
          drink: "Banana Injeolmi Matcha Latte",
          verdict: "For banana purée, soy cloud and kinako together.",
          details: "Banana purée sweetens the latte, topped with soy cloud and kinako. The SF pop-up is at 1377 Fell St.",
          milkNote: "Contains dairy. Kumo uses lactose-free dairy milk; soy cloud does not make the drink dairy-free.",
          price: "Price not published on the official menu",
          availability: "Sundays 9am–1pm; this seasonal drink is listed September 5, 2026–January 3, 2027.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.kumomatchaca.com/our-menu"
            },
            {
              label: "SF pop-up location and hours",
              url: "https://www.kumomatchaca.com/"
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Which banana matcha uses oat milk?",
          answer: "SŌHN explicitly lists a Banana Oat Milk Latte with a matcha option. If dairy avoidance matters, confirm the full recipe when ordering."
        },
        {
          question: "Is Kumo’s soy-cloud banana matcha dairy-free?",
          answer: "No. Its official menu marks the Banana Injeolmi Matcha Latte as containing dairy and says its milk drinks use lactose-free milk."
        },
        {
          question: "Are these ranked from best to worst?",
          answer: "No. The list helps you compare documented menus. We have not awarded a tasting winner."
        }
      ]
    },
    {
      slug: "matcha-cold-foam-san-francisco",
      title: "Matcha Cold Foam, Clouds & Cream Tops in SF",
      description: "Four places for matcha clouds and cream tops in San Francisco, with prices, seasonal availability and dairy notes.",
      emoji: "☁️",
      updatedAt: "2026-10-07",
      intro: "The foam is part of the order, not just a garnish. San Francisco cafés offer matcha with flavored cream, matcha-flavored clouds, and fruit-topped lattes. Start with these four documented menus, which span an extra layer of matcha, salted cheese cream, a Korean café cream top and an autumn London Fog twist. If you choose a plant milk underneath, check the topping separately.",
      methodology: "Official menus checked October 7, 2026. “Cold foam,” “cloud” and “cream top” are café menu terms, not a claim that every drink uses the same recipe. This guide is unranked and does not award a Best Cold Foam badge.",
      entries: [
        {
          shopId: "q-specialty-coffee",
          drink: "Velvet Matcha Cloud",
          verdict: "For a matcha latte topped with another matcha layer.",
          details: "Q lists matcha cloud over a matcha latte at its original 3490 California St café.",
          milkNote: "The menu does not spell out cloud ingredients or confirm a dairy-free topping; ask before ordering.",
          price: "$8.25",
          availability: "Daily 7am–5:30pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.qspecialtycoffee.com/menu"
            }
          ]
        },
        {
          shopId: "tadaima-mission",
          drink: "Matcha Latte with Salted Cheese Cream",
          verdict: "For the salted-cheese version.",
          details: "The Mission drink menu offers this iced latte at 3515 20th St, Suite B. Strawberry and pistachio cream versions are also listed.",
          milkNote: "Oat and almond substitutions cost $0.75 for the drink base. Cheese cream is not listed as dairy-free; soy is not listed.",
          price: "$7.50 before milk substitutions",
          availability: "Listed on the current drink menu; check café hours before visiting.",
          sources: [
            {
              label: "Official menu",
              url: "https://tadaimasf.com/san-francisco-suite-b-tadaima-sf-drink-menu"
            }
          ]
        },
        {
          shopId: "sohn",
          drink: "SŌHN Signature Cream Top with Matcha",
          verdict: "For a dedicated café cream-top order.",
          details: "Order the matcha option under Signature Cream Top at 2535 3rd St. The menu lists it as iced only.",
          milkNote: "Soy is not listed. The menu does not document a dairy-free cream top.",
          price: "$7",
          availability: "Tue–Sun 9am–4pm; closed Monday.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.sohnsf.com/s/Letter_0120_1-1.pdf"
            },
            {
              label: "Location and hours",
              url: "https://www.sohnsf.com/"
            }
          ]
        },
        {
          shopId: "kumo-matcha-divisadero-market",
          drink: "London Fog Matcha Latte",
          verdict: "For Earl Grey syrup and vanilla cloud.",
          details: "Kumo’s seasonal latte has Earl Grey syrup, Madagascar vanilla cloud and orange zest. Find the SF pop-up at 1377 Fell St.",
          milkNote: "Contains dairy; the base milk is lactose-free dairy milk.",
          price: "Price not published on the official menu",
          availability: "Listed as currently in season; SF service Sundays 9am–1pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.kumomatchaca.com/our-menu"
            },
            {
              label: "SF pop-up schedule",
              url: "https://www.kumomatchaca.com/"
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Does oat milk make a cloud matcha dairy-free?",
          answer: "Only if the topping and other ingredients are dairy-free too. Ask about the foam independently from the milk base."
        },
        {
          question: "Which menus have published prices?",
          answer: "Q, Tadaima and SŌHN publish the prices shown here. Kumo’s official menu describes the drink without a price."
        },
        {
          question: "Where is the Best Cold Foam winner?",
          answer: "This is a menu guide. A tasting-based award will be labeled separately with its judging method."
        }
      ]
    },
    {
      slug: "soy-milk-matcha-san-francisco",
      title: "Soy Milk Matcha in SF: Three Menus That List It",
      description: "Where to order matcha with soy milk in San Francisco, with verified menu options, prices and dairy-free ordering tips.",
      emoji: "🌱",
      updatedAt: "2026-10-07",
      intro: "Soy can be surprisingly hard to find on matcha menus, even when oat milk is everywhere. These three cafés explicitly list soy with their matcha or drink substitutions. They cover the Presidio, the northern waterfront and Japantown. Start with a plain latte, specify soy as the replacement milk, and ask about any added cream or premixed ingredients if you need the whole drink to be dairy-free.",
      methodology: "We checked official menus and merchant ordering pages on October 7, 2026. Inclusion means soy is listed, not that we have independently certified every recipe or allergy practice. This is an unranked ordering guide.",
      entries: [
        {
          shopId: "il-parco",
          drink: "Matcha Latte with Soy Milk",
          verdict: "For a soy matcha before a Presidio walk.",
          details: "Il Parco’s menu lists hot and iced matcha lattes and soy among its milk alternatives at 215 Lincoln Blvd.",
          milkNote: "Soy, oat or almond adds $0.50. Specify that soy replaces the base milk.",
          price: "$6 hot 12 oz; $6.30 iced 12 oz with soy",
          availability: "Daily 8am–8pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://ilparcosf.com/menu/cafe"
            }
          ]
        },
        {
          shopId: "lulu-fresh",
          drink: "Matcha Latte with Soy Milk",
          verdict: "For an explicitly selectable soy option near the waterfront.",
          details: "Lulu’s product page lets you choose hot or iced and select soy. The café is at 50 Francisco St, Suite 105.",
          milkNote: "Soy is listed alongside oat, almond and coconut. Confirm substitutions at checkout.",
          price: "$7 listed base price; check checkout for modifiers",
          availability: "Mon–Fri 7am–4pm; Sat 8am–4pm. Sunday hours are not listed on this page.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.lulufresh.co/products/matcha-latte"
            }
          ]
        },
        {
          shopId: "yakiniq-cafe",
          drink: "Matcha Latte with Soy Milk",
          verdict: "For a customizable Japantown latte.",
          details: "The Matcha Latte ordering page lists soy in its milk choices at 1640 Post St, first floor.",
          milkNote: "The option is labeled “Extra Soy Milk.” Ask the café to replace whole milk with soy if dairy avoidance matters.",
          price: "$7 base 12 oz + $0.75 soy; iced adds $0.25",
          availability: "Tue–Sat 11am–5pm; closed Sunday and Monday.",
          sources: [
            {
              label: "Official menu",
              url: "https://toast.app/r/yakiniq-cafe-1640-post-street-fl-1/order/item-matcha-latte_32d7f96b-093a-4e9e-aafa-c78e5fcc1b90"
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Is lactose-free milk dairy-free?",
          answer: "No. Lactose-free dairy milk is still dairy milk. Select a plant milk and check toppings and any premixed base."
        },
        {
          question: "Can I just pick soy online and assume the drink is dairy-free?",
          answer: "Check how the modifier is worded. YakiniQ labels it as extra soy, so ask for a replacement rather than an addition."
        },
        {
          question: "Why are some popular cafés missing?",
          answer: "This guide focuses on soy explicitly listed in the menus we checked. A café without listed soy may still offer it, but we do not assume that."
        }
      ]
    },
    {
      slug: "strawberry-matcha-san-francisco",
      title: "Strawberry Matcha in SF: Latte, Cloud or Cream?",
      description: "Four documented strawberry matcha orders in San Francisco, including classic fruit lattes and strawberry cloud toppings.",
      emoji: "🍓",
      updatedAt: "2026-10-07",
      intro: "Strawberry matcha is not one fixed recipe. Some menus put strawberry in the latte; others put it in a cloud or cream topping. These four stops let you compare the styles without guessing from a drink photo. Choose Stonemill or Four Chairs for a listed strawberry latte, Q for strawberry cloud, or Tadaima for strawberry cream. Each card links to the menu so you can check the latest options.",
      methodology: "Official café menus checked on October 7, 2026. Selections reflect named strawberry-and-matcha drinks. They are not ranked, and we do not make firsthand taste or sweetness judgments. Prices exclude tax and add-ons.",
      entries: [
        {
          shopId: "stonemill-matcha",
          drink: "Cold Strawberry Latte with Matcha",
          verdict: "For a strawberry latte with a choice of tea.",
          details: "The menu pairs strawberry with matcha or hojicha, milk and cane sugar. Choose matcha at 561 Valencia St.",
          milkNote: "Oat substitution is listed; soy is not.",
          price: "Price not published on this menu",
          availability: "Mon–Fri 10am–4pm; Sat–Sun 9am–7pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.stonemillmatcha-us.com/menu"
            },
            {
              label: "Official hours",
              url: "https://www.stonemillmatcha-us.com/"
            }
          ]
        },
        {
          shopId: "four-chairs",
          drink: "Strawberry Matcha",
          verdict: "For a matcha order alongside brunch.",
          details: "Four Chairs lists Strawberry Matcha at 3282 Mission St.",
          milkNote: "Whole milk is listed; Oatly or almond adds $1. Soy is not listed.",
          price: "$7; $8 with Oatly or almond",
          availability: "Mon–Fri 10am–2:30pm; Sat–Sun 9am–3pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.fourchairssf.com/_files/ugd/84dca7_1ddb14cf73d649339a46b81e3c2a91db.pdf"
            },
            {
              label: "Official hours",
              url: "https://www.fourchairssf.com/"
            }
          ]
        },
        {
          shopId: "q-specialty-coffee",
          drink: "Matcha Strawberry Cloud",
          verdict: "For strawberry in the topping.",
          details: "Q lists an organic matcha latte with house-made strawberry cloud and dried strawberry at 3490 California St.",
          milkNote: "Foam ingredients and dairy-free substitutions are not specified on this menu.",
          price: "$8.25",
          availability: "Daily 7am–5:30pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.qspecialtycoffee.com/menu"
            }
          ]
        },
        {
          shopId: "tadaima-mission",
          drink: "Matcha Latte with Strawberry Cream",
          verdict: "For an iced strawberry-cream latte.",
          details: "The Mission menu lists strawberry cream over matcha at 3515 20th St, Suite B.",
          milkNote: "Oat and almond substitutions are listed for $0.75; the cream is not listed as dairy-free. Soy is not listed.",
          price: "$7.75 before milk substitutions",
          availability: "Listed on the current drink menu; check café hours before visiting.",
          sources: [
            {
              label: "Official menu",
              url: "https://tadaimasf.com/san-francisco-suite-b-tadaima-sf-drink-menu"
            }
          ]
        }
      ],
      faqs: [
        {
          question: "What is the difference between strawberry latte and strawberry cloud?",
          answer: "The menu names tell you where to start: a fruit latte and a fruit topping are different builds. Ask how the strawberry is incorporated if you have a preference."
        },
        {
          question: "Can strawberry cream be made dairy-free?",
          answer: "A plant-milk base does not establish that the cream is dairy-free. None of these cream-topping menus confirms that substitution."
        },
        {
          question: "Which one is the least sweet?",
          answer: "We have not tasted them side by side or measured sugar. Ask which components can be reduced; fruit preparations and cream may have fixed sweetness."
        }
      ]
    },
    {
      slug: "ceremonial-hand-whisked-matcha-san-francisco",
      title: "Ceremonial & Hand-Whisked Matcha in San Francisco",
      description: "Three SF cafés documenting matcha sourcing or hand-whisking, with simple tea orders and latte options.",
      emoji: "🍵",
      updatedAt: "2026-10-07",
      intro: "If the tea itself is what you came for, start with preparation and sourcing details rather than a colorful topping. Stonemill names a hand-whisked order, Nagomi describes hand-whisking Shizuoka matcha, and Pixlcat identifies the Kyoto Uji matcha used for its lattes. These are three different ways to explore the tea. A sourcing description can help you choose an order; it does not replace tasting it yourself.",
      methodology: "Official café pages checked October 7, 2026. “Ceremonial” is reported as the café describes its matcha; we do not treat that word alone as an independent quality award. Hand-whisking is identified only where the café explicitly documents it.",
      entries: [
        {
          shopId: "stonemill-matcha",
          drink: "Hand Whisked Matcha",
          verdict: "For a named hand-whisked tea order.",
          details: "Stonemill lists First Crop matcha served with small yuzu meringues. Its Matchacano is another water-based order at 561 Valencia St.",
          milkNote: "The hand-whisked order is separate from the milk lattes. Ask about the accompanying sweet if you have dietary restrictions.",
          price: "Price not published on the official menu",
          availability: "Mon–Fri 10am–4pm; Sat–Sun 9am–7pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.stonemillmatcha-us.com/menu"
            },
            {
              label: "Official hours",
              url: "https://www.stonemillmatcha-us.com/"
            }
          ]
        },
        {
          shopId: "nagomi",
          drink: "Oyaizu Heavenly Sky Matcha Latte",
          verdict: "For a café that names its Shizuoka producer.",
          details: "Nagomi describes hand-whisking Oyaizu Seicha’s Heavenly Sky #65 and #90 matcha at 74 New Montgomery St.",
          milkNote: "The site names Straus dairy milk. Soy and plant-milk substitutions are not listed there.",
          price: "Price not published on the official site",
          availability: "The site currently shows 10:30am–5pm as temporary hours; check before visiting.",
          sources: [
            {
              label: "Official menu",
              url: "https://cafenagomi.com/"
            }
          ]
        },
        {
          shopId: "pixlcat-coffee",
          drink: "Organic Matcha Latte",
          verdict: "For a Kyoto Uji matcha latte in the Inner Richmond.",
          details: "Pixlcat describes hot or iced organic matcha lattes made with ceremonial-grade Kyoto Uji matcha at 519 Clement St.",
          milkNote: "Soy and other latte milk choices are not specified on this page.",
          price: "Check the linked ordering menu for the current drink price",
          availability: "Mon–Fri 7am–4pm; Sat–Sun 7am–5pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.pixlcatcoffee.com/order-now"
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Does ceremonial-grade automatically mean best?",
          answer: "No. We report the café’s description and link its source. We have not independently scored the matcha or awarded a winner."
        },
        {
          question: "Which café explicitly lists hand-whisked matcha?",
          answer: "Stonemill names a Hand Whisked Matcha order. Nagomi also describes hand-whisking its matcha on its official site."
        },
        {
          question: "How can I compare the tea without flavored cream?",
          answer: "Ask about a simple water-based matcha order or a plain latte. Use the same milk and sweetness preference when comparing cafés."
        }
      ]
    },
    {
      slug: "matcha-under-seven-dollars-san-francisco",
      title: "Matcha Under $7 in San Francisco",
      description: "Four SF matcha menus with options below $7 before tax, including plant-milk prices and a matcha soda.",
      emoji: "💸",
      updatedAt: "2026-10-07",
      intro: "A matcha order can stay below $7 if you watch size, temperature and milk surcharges. These four official menus list qualifying drinks without needing a promo code. The prices below are before tax, tip and extras. Paper Son also has a milk-free-style soda build, while Il Parco publishes enough size and milk detail to plan a soy order. Check the checkout total before paying; this guide uses the menu prices available on the update date.",
      methodology: "Official menus checked October 7, 2026. Every featured base drink is listed strictly below $7. This is a price guide, not a Best Value taste award. Delivery prices and fees can differ from café prices.",
      entries: [
        {
          shopId: "paper-son-coffee-fidi",
          drink: "Matcha Latte or Matcha Passionfruit Soda",
          verdict: "For two matcha orders listed at the same price.",
          details: "Paper Son’s menu lists both at $6. Visit Downtown at 303 2nd St N102.",
          milkNote: "Oat or almond adds $0.25 to the latte. Soy is not listed.",
          price: "$6; latte with oat or almond $6.25",
          availability: "Downtown Mon–Fri 8am–3:30pm; closed weekends.",
          sources: [
            {
              label: "Official menu",
              url: "https://papersoncoffee.com/menu"
            },
            {
              label: "Official locations and hours",
              url: "https://papersoncoffee.com/locations"
            }
          ]
        },
        {
          shopId: "il-parco",
          drink: "12 oz Matcha Latte",
          verdict: "For a published soy price that stays under $7.",
          details: "At 215 Lincoln Blvd, the 12-ounce latte is $5.50 hot or $5.80 iced.",
          milkNote: "Soy, oat and almond add $0.50.",
          price: "$5.50 hot / $5.80 iced; with plant milk $6 / $6.30",
          availability: "Daily 8am–8pm.",
          sources: [
            {
              label: "Official menu",
              url: "https://ilparcosf.com/menu/cafe"
            }
          ]
        },
        {
          shopId: "tadaima-mission",
          drink: "Classic Matcha Latte",
          verdict: "For a hot latte that leaves room for a milk swap.",
          details: "The Mission menu at 3515 20th St, Suite B lists its classic latte hot or iced.",
          milkNote: "Oat or almond adds $0.75: hot reaches $7, iced reaches $7.50. Soy is not listed.",
          price: "$6.25 hot / $6.75 iced before substitutions",
          availability: "Listed on the current drink menu; check café hours before visiting.",
          sources: [
            {
              label: "Official menu",
              url: "https://tadaimasf.com/san-francisco-suite-b-tadaima-sf-drink-menu"
            }
          ]
        },
        {
          shopId: "sohn",
          drink: "Matcha Latte or Matchacano",
          verdict: "For a $6 matcha order in Dogpatch.",
          details: "SŌHN lists both orders at $6 at 2535 3rd St. Its banana and cream-top signatures cost $7 and fall outside this list.",
          milkNote: "Oat and almond alternatives are listed without a charge; soy is not listed.",
          price: "$6",
          availability: "Tue–Sun 9am–4pm; closed Monday.",
          sources: [
            {
              label: "Official menu",
              url: "https://www.sohnsf.com/s/Letter_0120_1-1.pdf"
            },
            {
              label: "Official hours",
              url: "https://www.sohnsf.com/"
            }
          ]
        }
      ],
      faqs: [
        {
          question: "Do these prices include tax?",
          answer: "No. The guide compares published menu prices before tax, tip, optional extras and delivery fees."
        },
        {
          question: "Which plant-milk orders stay under $7?",
          answer: "The listed Il Parco 12-ounce latte with soy, oat or almond and Paper Son latte with oat or almond stay below $7 before tax. SŌHN lists free oat or almond alternatives."
        },
        {
          question: "Does a $1-off SF Matcha code already work here?",
          answer: "No offer is implied by inclusion. A café discount is valid only when an active offer explicitly lists its participating café and terms."
        }
      ]
    }
  ];

  // lib/newsletter-client.mjs
  function newsletterEndpoint(value, origin = "https://sanfranciscomatcha.com") {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, origin);
      if (url.username || url.password || url.hash) return "";
      if (url.protocol !== "https:" && !(["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol === "http:")) return "";
      return url.href;
    } catch {
      return "";
    }
  }
  async function subscribe({ endpoint, email, consent, website = "", fetchImpl = fetch }) {
    if (!newsletterEndpoint(endpoint)) throw new Error("Signup is not available yet.");
    if (consent !== true) throw new Error("Please agree to receive SF Matcha emails.");
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), consent: true, website, source: "homepage", consentVersion: "2026-10-07" }),
      signal: AbortSignal.timeout(15e3)
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Signup could not be completed. Please try again later.");
    }
    if (!response.ok || result?.success !== true) throw new Error("Signup could not be completed. Please try again later.");
    return "Thanks! Your signup has been received. You can unsubscribe from any email.";
  }

  // app.jsx
  var { useState, useMemo, useEffect, useRef } = React;
  var FILTERS = [
    { id: "all", label: "all spots", emoji: "🍵" },
    { id: "top", label: "top picks", emoji: "⭐" },
    { id: "buzzy", label: "new / buzzy", emoji: "✨" },
    { id: "confirmed", label: "soy confirmed", emoji: "✓" },
    { id: "reported", label: "soy reported", emoji: "?" },
    { id: "none", label: "no soy listed", emoji: "✗" },
    { id: "call", label: "soy TBD", emoji: "…" }
  ];
  var PRIMARY_FILTERS = FILTERS.slice(0, 3);
  var SOY_FILTERS = FILTERS.slice(3);
  var GOOGLE_MAP_CENTER = { lat: 37.765, lng: -122.436 };
  var googleMapsLoadPromise = null;
  function getMapsApiKey() {
    return window.SF_MATCHA_CONFIG && window.SF_MATCHA_CONFIG.googleMapsApiKey || "";
  }
  function loadGoogleMapsScript(apiKey) {
    if (window.google && window.google.maps && window.google.maps.Map) return Promise.resolve(window.google.maps);
    if (googleMapsLoadPromise) return googleMapsLoadPromise;
    googleMapsLoadPromise = new Promise((resolve, reject) => {
      const callbackName = "__sfMatchaGoogleMapsReady";
      window[callbackName] = () => resolve(window.google.maps);
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return googleMapsLoadPromise;
  }
  function App() {
    const [tweaks, setTweak] = useTweaks(
      /*EDITMODE-BEGIN*/
      {
        "palette": "matcha",
        "pinStyle": "sticker",
        "showLabels": true,
        "marqueeSpeed": 40,
        "headerCopy": "san francisco matcha spots, all in one map.",
        "wobble": true
      }
      /*EDITMODE-END*/
    );
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [hovered, setHovered] = useState(null);
    const palettes = {
      matcha: { bg: "#FFF8E7", ink: "#1a1a1a", pop: "#8FBF3F", pop2: "#EE6C4D", lime: "#D9FF3F" },
      sunset: { bg: "#FFEFE0", ink: "#1a1a1a", pop: "#FF7A4D", pop2: "#FFD13D", lime: "#FF4FA8" },
      midnight: { bg: "#0F1A0F", ink: "#F5FFE0", pop: "#D9FF3F", pop2: "#FF4FA8", lime: "#8FBF3F" },
      bubblegum: { bg: "#FFE6F0", ink: "#1a1a1a", pop: "#FF4FA8", pop2: "#7FC4FF", lime: "#D9FF3F" }
    };
    const C = palettes[tweaks.palette] || palettes.matcha;
    const filtered = useMemo(() => {
      return SHOPS.filter((s) => {
        if (filter === "top" && !s.topPick) return false;
        if (filter === "buzzy" && !s.buzzy) return false;
        if (["confirmed", "reported", "none", "call"].includes(filter) && s.status !== filter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!(s.name.toLowerCase().includes(q) || s.hood.toLowerCase().includes(q) || s.note.toLowerCase().includes(q) || s.address.toLowerCase().includes(q))) return false;
        }
        return true;
      });
    }, [filter, search]);
    const visibleIds = new Set(filtered.map((s) => s.id));
    const stats = useMemo(() => ({
      shown: filtered.length,
      confirmed: filtered.filter((s) => s.status === "confirmed").length,
      buzzy: filtered.filter((s) => s.buzzy).length,
      top: filtered.filter((s) => s.topPick).length
    }), [filtered]);
    return /* @__PURE__ */ React.createElement("div", { style: { "--bg": C.bg, "--ink": C.ink, "--pop": C.pop, "--pop2": C.pop2, "--lime": C.lime, background: C.bg, color: C.ink, minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(Marquee, { speed: tweaks.marqueeSpeed }), /* @__PURE__ */ React.createElement(Header, { copy: tweaks.headerCopy, C }), /* @__PURE__ */ React.createElement(NewsletterSignup, null), /* @__PURE__ */ React.createElement("div", { className: "guide-discovery" }, /* @__PURE__ */ React.createElement("a", { href: "/guides/" }, /* @__PURE__ */ React.createElement("strong", null, guides_default.length, " guides for your next cup →"), /* @__PURE__ */ React.createElement("span", null, "banana · cold foam · soy milk · strawberry · ceremonial · under $7"))), /* @__PURE__ */ React.createElement(FilterBar, { filter, setFilter, stats, C }), /* @__PURE__ */ React.createElement("div", { className: "main-grid", style: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, padding: "0 32px 48px", maxWidth: 1600, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(
      MapPanel,
      {
        shops: SHOPS,
        visibleIds,
        selected,
        setSelected,
        hovered,
        setHovered,
        C,
        tweaks,
        search,
        setSearch
      }
    ), /* @__PURE__ */ React.createElement(
      ShopList,
      {
        shops: filtered,
        selected,
        setSelected,
        hovered,
        setHovered,
        C
      }
    )), /* @__PURE__ */ React.createElement(Footer, { C }), /* @__PURE__ */ React.createElement(TweaksPanel, { title: "Tweaks" }, /* @__PURE__ */ React.createElement(TweakSection, { title: "Palette" }, /* @__PURE__ */ React.createElement(
      TweakSelect,
      {
        tweakKey: "palette",
        value: tweaks.palette,
        onChange: setTweak,
        options: [
          { value: "matcha", label: "matcha cream (default)" },
          { value: "sunset", label: "sunset orange" },
          { value: "midnight", label: "midnight green" },
          { value: "bubblegum", label: "bubblegum pink" }
        ]
      }
    )), /* @__PURE__ */ React.createElement(TweakSection, { title: "Pin style" }, /* @__PURE__ */ React.createElement(
      TweakRadio,
      {
        tweakKey: "pinStyle",
        value: tweaks.pinStyle,
        onChange: setTweak,
        options: [
          { value: "sticker", label: "sticker" },
          { value: "splat", label: "splat" },
          { value: "blob", label: "blob" }
        ]
      }
    )), /* @__PURE__ */ React.createElement(TweakSection, { title: "Animation" }, /* @__PURE__ */ React.createElement(TweakToggle, { tweakKey: "wobble", value: tweaks.wobble, onChange: setTweak, label: "pin wobble" }), /* @__PURE__ */ React.createElement(TweakToggle, { tweakKey: "showLabels", value: tweaks.showLabels, onChange: setTweak, label: "show pin labels" }), /* @__PURE__ */ React.createElement(
      TweakSlider,
      {
        tweakKey: "marqueeSpeed",
        value: tweaks.marqueeSpeed,
        onChange: setTweak,
        label: "marquee speed",
        min: 10,
        max: 120,
        step: 5
      }
    )), /* @__PURE__ */ React.createElement(TweakSection, { title: "Copy" }, /* @__PURE__ */ React.createElement(TweakText, { tweakKey: "headerCopy", value: tweaks.headerCopy, onChange: setTweak, label: "hero tagline" }))), selected && /* @__PURE__ */ React.createElement(ShopDetail, { shop: SHOPS.find((s) => s.id === selected), onClose: () => setSelected(null), C }));
  }
  function Marquee({ speed }) {
    const items = [
      "🍵 sf matcha, mapped",
      `✦ ${guides_default.length} menu-backed guides`,
      `🌿 ${SHOPS.length} spots mapped`,
      "✿ soy info at a glance",
      "⭐ local favorites highlighted",
      "🎀 tap a pin for details"
    ];
    const loop = [...items, ...items, ...items];
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--ink)",
      color: "var(--bg)",
      overflow: "hidden",
      borderBottom: "3px solid var(--ink)",
      padding: "10px 0",
      fontFamily: "'Space Mono', monospace",
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: "0.04em"
    } }, /* @__PURE__ */ React.createElement("div", { className: "marquee-track", style: {
      display: "inline-flex",
      whiteSpace: "nowrap",
      animation: `marquee ${speed}s linear infinite`,
      gap: 36
    } }, loop.map(
      (t, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { display: "inline-flex", gap: 36, alignItems: "center" } }, t, " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--pop)" } }, "★"))
    )));
  }
  function Header({ copy, C }) {
    return /* @__PURE__ */ React.createElement("header", { style: { padding: "40px 32px 16px", maxWidth: 1600, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("nav", { className: "site-nav", "aria-label": "Main navigation" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "Map"), /* @__PURE__ */ React.createElement("a", { href: "/guides/" }, "Guides"), /* @__PURE__ */ React.createElement("a", { href: "/perks/" }, "Perks"), /* @__PURE__ */ React.createElement("a", { href: "/methodology/" }, "Our approach")), /* @__PURE__ */ React.createElement("h1", { style: {
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 800,
      fontSize: "clamp(64px, 11vw, 160px)",
      lineHeight: 0.88,
      margin: 0,
      letterSpacing: "-0.05em",
      color: "var(--pop)"
    } }, "sf matcha", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--pop)" } }, ".")), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "'Nunito', sans-serif",
      fontSize: 20,
      marginTop: 14,
      maxWidth: 640,
      lineHeight: 1.4,
      fontWeight: 500
    } }, copy));
  }
  function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const endpoint = newsletterEndpoint(window.SF_MATCHA_CONFIG?.newsletterEndpoint, window.location.origin);
    async function handleSubmit(event) {
      event.preventDefault();
      if (status === "submitting") return;
      setStatus("submitting");
      setMessage("");
      try {
        setMessage(await subscribe({ endpoint, email, consent, website }));
        setStatus("success");
        setEmail("");
        setConsent(false);
      } catch {
        setStatus("error");
        setMessage("Signup could not be completed. Please try again later.");
      }
    }
    return /* @__PURE__ */ React.createElement("section", { className: "newsletter-band", "aria-labelledby": "newsletter-heading" }, /* @__PURE__ */ React.createElement("div", { className: "newsletter-inner" }, /* @__PURE__ */ React.createElement("h2", { id: "newsletter-heading" }, "Want new matcha spots in your inbox?"), /* @__PURE__ */ React.createElement("div", { className: "newsletter-action" }, endpoint ? /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement("div", { className: "newsletter-form" }, /* @__PURE__ */ React.createElement("label", { className: "sr-only", htmlFor: "newsletter-email" }, "Email address"), /* @__PURE__ */ React.createElement("input", { id: "newsletter-email", type: "email", inputMode: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your email", disabled: status === "submitting" }), /* @__PURE__ */ React.createElement("button", { type: "submit", "aria-label": "Subscribe for new matcha spot alerts", disabled: status === "submitting" }, /* @__PURE__ */ React.createElement("span", { className: "material-symbols-rounded", "aria-hidden": "true" }, "arrow_forward"))), /* @__PURE__ */ React.createElement("label", { className: "newsletter-consent" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", required: true, checked: consent, onChange: (e) => setConsent(e.target.checked), disabled: status === "submitting" }), " Send me SF Matcha guides and new-spot emails. Unsubscribe anytime."), /* @__PURE__ */ React.createElement("label", { className: "newsletter-trap", "aria-hidden": "true" }, "Website", /* @__PURE__ */ React.createElement("input", { tabIndex: -1, autoComplete: "off", value: website, onChange: (e) => setWebsite(e.target.value) })), /* @__PURE__ */ React.createElement("a", { className: "newsletter-privacy", href: "/privacy/" }, "Privacy details")) : /* @__PURE__ */ React.createElement("p", { className: "newsletter-coming" }, "Email alerts are coming soon. ", /* @__PURE__ */ React.createElement("a", { href: "/guides/" }, "Explore the new guides →")), /* @__PURE__ */ React.createElement("div", { className: `newsletter-message ${status}`, role: status === "error" ? "alert" : "status", "aria-live": "polite" }, message))));
  }
  function mapsUrl(shop) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${shop.name} ${shop.address} San Francisco CA`);
  }
  function displayHours(hours) {
    return hours || "hours not listed";
  }
  function FilterBar({ filter, setFilter, stats, C }) {
    const [soyOpen, setSoyOpen] = useState(false);
    const activeSoy = SOY_FILTERS.find((item) => item.id === filter);
    return /* @__PURE__ */ React.createElement("div", { className: "filter-bar" }, /* @__PURE__ */ React.createElement("div", { className: "filter-tabs", role: "group", "aria-label": "Filter matcha spots" }, PRIMARY_FILTERS.map((item) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item.id,
        className: `filter-tab ${filter === item.id ? "active" : ""}`,
        onClick: () => setFilter(item.id)
      },
      item.label
    )), /* @__PURE__ */ React.createElement("div", { className: "soy-filter" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `filter-tab ${activeSoy ? "active" : ""}`,
        onClick: () => setSoyOpen((open) => !open),
        "aria-expanded": soyOpen,
        "aria-haspopup": "menu"
      },
      activeSoy ? activeSoy.label : "soy options",
      /* @__PURE__ */ React.createElement("span", { className: "material-symbols-rounded", "aria-hidden": "true" }, soyOpen ? "expand_less" : "expand_more")
    ), soyOpen && /* @__PURE__ */ React.createElement("div", { className: "soy-menu", role: "menu" }, SOY_FILTERS.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, role: "menuitem", onClick: () => {
      setFilter(item.id);
      setSoyOpen(false);
    } }, item.label))))), /* @__PURE__ */ React.createElement("div", { className: "filter-stats", style: { display: "flex", gap: 24, fontFamily: "'Bricolage Grotesque', sans-serif", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Stat, { n: stats.shown, label: "shown", pop: "var(--pop)" }), /* @__PURE__ */ React.createElement(Stat, { n: stats.confirmed, label: "soy ✓", pop: "var(--pop)" }), /* @__PURE__ */ React.createElement(Stat, { n: stats.top, label: "top picks", pop: "var(--pop2)" }), /* @__PURE__ */ React.createElement(Stat, { n: stats.buzzy, label: "buzzy", pop: "var(--lime)" })));
  }
  function Stat({ n, label, pop }) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, fontSize: 32, lineHeight: 1, color: pop, textShadow: "1px 1px 0 var(--ink)" } }, n), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'Space Mono', monospace", fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" } }, label));
  }
  function MapPanel({ shops, visibleIds, selected, setSelected, hovered, setHovered, C, tweaks, search, setSearch }) {
    const hasGoogleMapsKey = Boolean(getMapsApiKey());
    return /* @__PURE__ */ React.createElement("div", { className: "map-panel", style: {
      position: "sticky",
      top: 18,
      alignSelf: "start",
      borderRadius: 32,
      border: "3px solid var(--ink)",
      boxShadow: "8px 8px 0 var(--ink)",
      overflow: "hidden",
      background: "#C9E8FF",
      aspectRatio: "1 / 1",
      minHeight: 560,
      minWidth: 0,
      width: "100%"
    } }, hasGoogleMapsKey ? /* @__PURE__ */ React.createElement(
      GoogleMapLayer,
      {
        shops,
        visibleIds,
        selected,
        setSelected,
        hovered,
        setHovered,
        tweaks
      }
    ) : /* @__PURE__ */ React.createElement(SFMapSVG, null), !hasGoogleMapsKey && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0 } }, shops.map((s) => {
      const isVisible = visibleIds.has(s.id);
      const isHover = hovered === s.id;
      const isSelected = selected === s.id;
      return /* @__PURE__ */ React.createElement(
        Pin,
        {
          key: s.id,
          shop: s,
          x: s.x,
          y: s.y,
          dimmed: !isVisible,
          hovered: isHover,
          selected: isSelected,
          onHover: setHovered,
          onClick: () => setSelected(s.id),
          showLabel: tweaks.showLabels,
          wobble: tweaks.wobble,
          style: tweaks.pinStyle
        }
      );
    })), /* @__PURE__ */ React.createElement("div", { className: "map-search" }, /* @__PURE__ */ React.createElement("span", { className: "material-symbols-rounded", "aria-hidden": "true" }, "search"), /* @__PURE__ */ React.createElement("label", { className: "sr-only", htmlFor: "map-search-input" }, "Search the map"), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "map-search-input",
        value: search,
        onChange: (event) => setSearch(event.target.value),
        placeholder: "search map"
      }
    ), search && /* @__PURE__ */ React.createElement("button", { onClick: () => setSearch(""), "aria-label": "Clear map search" }, /* @__PURE__ */ React.createElement("span", { className: "material-symbols-rounded", "aria-hidden": "true" }, "close"))), /* @__PURE__ */ React.createElement("div", { className: "map-legend", style: {
      position: "absolute",
      bottom: 16,
      left: 16,
      background: "rgba(255,248,231,0.95)",
      border: "2.5px solid var(--ink)",
      borderRadius: 16,
      boxShadow: "4px 4px 0 var(--ink)",
      padding: "12px 14px",
      fontFamily: "'Space Mono', monospace",
      fontSize: 11,
      fontWeight: 700,
      backdropFilter: "blur(4px)"
    } }, /* @__PURE__ */ React.createElement("div", { className: "map-legend-title", style: { marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, fontWeight: 800 } }, "legend"), Object.entries(STATUS_META).map(
      ([k, v]) => /* @__PURE__ */ React.createElement("div", { className: "map-legend-row", key: k, style: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "map-legend-dot", style: {
        width: 14,
        height: 14,
        borderRadius: 999,
        background: v.color,
        border: "1.5px solid var(--ink)",
        display: "inline-block"
      } }), /* @__PURE__ */ React.createElement("span", null, v.label))
    )), /* @__PURE__ */ React.createElement("div", { className: "map-corner-badge", style: {
      position: "absolute",
      top: 16,
      right: 16,
      background: "var(--pop)",
      color: "var(--ink)",
      border: "2.5px solid var(--ink)",
      borderRadius: 999,
      boxShadow: "4px 4px 0 var(--ink)",
      padding: "8px 14px",
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 800,
      fontSize: 13,
      transform: "rotate(4deg)",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    } }, /* @__PURE__ */ React.createElement("span", { className: "map-badge-full" }, hasGoogleMapsKey ? "google map + pins" : "🗺️ tap a pin"), /* @__PURE__ */ React.createElement("span", { className: "map-badge-compact" }, hasGoogleMapsKey ? "map + pins" : "tap a pin")));
  }
  function GoogleMapLayer({ shops, visibleIds, selected, setSelected, hovered, setHovered, tweaks }) {
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const overlayRef = useRef(null);
    const [mapStatus, setMapStatus] = useState("loading");
    useEffect(() => {
      let cancelled = false;
      const apiKey = getMapsApiKey();
      loadGoogleMapsScript(apiKey).then((maps) => {
        if (cancelled || !mapEl.current) return;
        const map = new maps.Map(mapEl.current, {
          center: GOOGLE_MAP_CENTER,
          zoom: 12.45,
          minZoom: 11,
          maxZoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
          backgroundColor: "#C9E8FF",
          styles: [
            { elementType: "geometry", stylers: [{ saturation: -45 }, { lightness: 24 }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#5C624F" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#FFF8E7" }, { weight: 3 }] },
            { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#b9c6a7" }, { weight: 0.7 }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#DDE9C8" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }, { lightness: 12 }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#D8D2C4" }] },
            { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "simplified" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#F5EACB" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#BFE2FF" }] }
          ]
        });
        const bounds = new maps.LatLngBounds();
        shops.forEach((shop) => {
          if (shop.lat && shop.lng) bounds.extend({ lat: shop.lat, lng: shop.lng });
        });
        map.fitBounds(bounds, window.innerWidth < 700 ? 46 : 72);
        const layer = document.createElement("div");
        layer.style.position = "absolute";
        layer.style.inset = "0";
        layer.style.pointerEvents = "none";
        const overlay = new maps.OverlayView();
        overlay.onAdd = function() {
          this.getPanes().overlayMouseTarget.appendChild(layer);
        };
        overlay.draw = function() {
          const projection = this.getProjection();
          if (!projection) return;
          renderGoogleMapPins(layer, projection, overlay._state);
        };
        overlay.onRemove = function() {
          layer.remove();
        };
        overlay._state = { shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks };
        overlay.setMap(map);
        mapRef.current = map;
        overlayRef.current = overlay;
        setMapStatus("ready");
      }).catch(() => {
        if (!cancelled) setMapStatus("error");
      });
      return () => {
        cancelled = true;
        if (overlayRef.current) overlayRef.current.setMap(null);
      };
    }, []);
    useEffect(() => {
      if (!overlayRef.current) return;
      overlayRef.current._state = { shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks };
      overlayRef.current.draw();
    }, [shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ref: mapEl, style: { position: "absolute", inset: 0 } }), mapStatus !== "ready" && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      background: mapStatus === "error" ? "#C9E8FF" : "rgba(255,248,231,0.72)"
    } }, mapStatus === "error" && /* @__PURE__ */ React.createElement(SFMapSVG, null), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 18,
      top: 18,
      background: "rgba(255,248,231,0.96)",
      border: "2.5px solid var(--ink)",
      borderRadius: 16,
      boxShadow: "4px 4px 0 var(--ink)",
      padding: "10px 12px",
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 11
    } }, mapStatus === "error" ? "The map is temporarily unavailable. The spot list still works below." : "loading Google map...")));
  }
  function renderGoogleMapPins(layer, projection, state) {
    if (!state) return;
    const { shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks } = state;
    layer.innerHTML = "";
    shops.forEach((shop) => {
      if (!shop.lat || !shop.lng) return;
      const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(shop.lat, shop.lng));
      const meta = STATUS_META[shop.status];
      const pinSize = window.innerWidth < 700 ? 42 : 46;
      const starSize = window.innerWidth < 700 ? 18 : 20;
      const isVisible = visibleIds.has(shop.id);
      const isHovered = hovered === shop.id;
      const isSelected = selected === shop.id;
      const pin = document.createElement("button");
      pin.type = "button";
      pin.setAttribute("aria-label", shop.name);
      pin.style.cssText = [
        "position:absolute",
        `left:${point.x}px`,
        `top:${point.y}px`,
        `width:${pinSize}px`,
        `height:${pinSize}px`,
        "border-radius:999px",
        "border:3px solid #1a1a1a",
        `background:${meta.color}`,
        "box-shadow:3px 3px 0 #1a1a1a",
        "display:grid",
        "place-items:center",
        `font-size:${window.innerWidth < 700 ? 21 : 23}px`,
        "line-height:1",
        "cursor:pointer",
        "pointer-events:auto",
        "transition:transform .18s cubic-bezier(.34,1.56,.64,1), opacity .18s",
        `transform:translate(-50%, -50%) ${isHovered || isSelected ? "scale(1.18)" : "scale(1)"}`,
        `opacity:${isVisible ? 1 : 0.18}`,
        `z-index:${isSelected ? 100 : isHovered ? 50 : 10}`
      ].join(";");
      if (tweaks.wobble && isVisible) {
        pin.style.animation = `wobble${shop.id.length % 4} ${3 + shop.id.length % 5 * 0.3}s ease-in-out infinite`;
      }
      pin.textContent = shop.emoji;
      pin.addEventListener("mouseenter", () => setHovered(shop.id));
      pin.addEventListener("mouseleave", () => setHovered(null));
      pin.addEventListener("click", () => setSelected(shop.id));
      layer.appendChild(pin);
      if (shop.topPick) {
        const star = document.createElement("span");
        star.textContent = "★";
        star.style.cssText = `position:absolute;right:-7px;top:-7px;width:${starSize}px;height:${starSize}px;border-radius:999px;background:var(--pop2);color:#fff;border:2px solid #1a1a1a;display:grid;place-items:center;font-size:11px;font-weight:800;transform:rotate(15deg);pointer-events:none;`;
        pin.appendChild(star);
      }
      if (tweaks.showLabels && (isHovered || isSelected)) {
        const label = document.createElement("div");
        label.style.cssText = "position:absolute;left:50%;top:100%;transform:translate(-50%,8px);background:#1a1a1a;color:var(--bg);padding:6px 10px;border-radius:8px;white-space:nowrap;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:13px;pointer-events:none;box-shadow:2px 2px 0 var(--pop);";
        label.innerHTML = `${shop.name}<div style="font-family:'Space Mono',monospace;font-size:10px;opacity:.7;font-weight:400;">${shop.hood} · ${meta.short}</div>`;
        pin.appendChild(label);
      }
    });
  }
  function Pin({ shop, x, y, dimmed, hovered, selected, onHover, onClick, showLabel, wobble, style }) {
    const meta = STATUS_META[shop.status];
    const z = selected ? 100 : hovered ? 50 : 10;
    let shape;
    if (style === "splat") {
      shape = /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 100 100", style: { width: "100%", height: "100%", overflow: "visible" } }, /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M 50,5 Q 70,10 75,25 Q 95,30 90,50 Q 95,75 70,80 Q 60,95 45,90 Q 25,98 18,75 Q 2,68 8,50 Q 2,28 25,22 Q 32,5 50,5 Z",
          fill: meta.color,
          stroke: "#1a1a1a",
          strokeWidth: "3"
        }
      ));
    } else if (style === "blob") {
      shape = /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 100 100", style: { width: "100%", height: "100%", overflow: "visible" } }, /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M 50,4 Q 80,12 88,38 Q 96,62 78,82 Q 60,98 40,90 Q 16,82 8,58 Q 2,32 22,14 Q 36,2 50,4 Z",
          fill: meta.color,
          stroke: "#1a1a1a",
          strokeWidth: "3"
        }
      ));
    } else {
      shape = /* @__PURE__ */ React.createElement("div", { style: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: meta.color,
        border: "3px solid #1a1a1a"
      } });
    }
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onMouseEnter: () => onHover(shop.id),
        onMouseLeave: () => onHover(null),
        onClick,
        style: {
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) ${hovered || selected ? "scale(1.18)" : "scale(1)"}`,
          transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1), opacity 0.18s",
          opacity: dimmed ? 0.18 : 1,
          cursor: "pointer",
          zIndex: z,
          animation: wobble && !dimmed ? `wobble${shop.id.length % 4} ${3 + shop.id.length % 5 * 0.3}s ease-in-out infinite` : "none"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        position: "relative",
        width: 56,
        height: 56,
        filter: hovered || selected ? "drop-shadow(3px 3px 0 #1a1a1a)" : "drop-shadow(2px 2px 0 #1a1a1a)"
      } }, shape, /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        fontSize: 28,
        lineHeight: 1,
        userSelect: "none"
      } }, shop.emoji), shop.topPick && /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        top: -8,
        right: -8,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "var(--pop2)",
        color: "#fff",
        border: "2px solid #1a1a1a",
        display: "grid",
        placeItems: "center",
        fontSize: 12,
        fontWeight: 800,
        transform: "rotate(15deg)"
      } }, "★")),
      showLabel && (hovered || selected) && /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        left: "50%",
        top: "100%",
        transform: "translate(-50%, 8px)",
        background: "#1a1a1a",
        color: "var(--bg)",
        padding: "6px 10px",
        borderRadius: 8,
        whiteSpace: "nowrap",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        pointerEvents: "none",
        boxShadow: "2px 2px 0 var(--pop)"
      } }, shop.name, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Space Mono', monospace", fontSize: 10, opacity: 0.7, fontWeight: 400 } }, shop.hood, " · ", meta.short))
    );
  }
  function ShopList({ shops, selected, setSelected, hovered, setHovered, C }) {
    if (shops.length === 0) {
      return /* @__PURE__ */ React.createElement("div", { style: {
        border: "3px dashed var(--ink)",
        borderRadius: 32,
        padding: 48,
        textAlign: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 56, marginBottom: 12 } }, "🍵"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 800, fontSize: 24 } }, "no spots match"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, opacity: 0.6 } }, "try a different filter or search."));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "shop-list", style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      paddingRight: 4,
      paddingBottom: 8
    } }, shops.map(
      (s, i) => /* @__PURE__ */ React.createElement(
        ShopCard,
        {
          key: s.id,
          shop: s,
          index: i,
          selected: selected === s.id,
          hovered: hovered === s.id,
          onHover: () => setHovered(s.id),
          onLeave: () => setHovered(null),
          onClick: () => setSelected(s.id)
        }
      )
    ));
  }
  function ShopCard({ shop, index, selected, hovered, onHover, onLeave, onClick }) {
    const meta = STATUS_META[shop.status];
    const tilts = [-1, 0.5, -0.5, 1, 0, -1.5, 1.2];
    const tilt = tilts[index % tilts.length];
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "shop-card",
        onMouseEnter: onHover,
        onMouseLeave: onLeave,
        onClick,
        style: {
          background: "#fff",
          border: "2.5px solid var(--ink)",
          borderRadius: 22,
          padding: 18,
          boxShadow: hovered || selected ? "6px 6px 0 var(--pop)" : "4px 4px 0 var(--ink)",
          transform: `rotate(${tilt}deg) ${hovered || selected ? "translate(-2px, -2px)" : "none"}`,
          transition: "all 0.18s",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "auto minmax(0, 1fr) minmax(132px, 34%)",
          gap: 14,
          alignItems: "flex-start"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "shop-card-icon", style: {
        width: 54,
        height: 54,
        borderRadius: "50%",
        background: meta.color,
        border: "2.5px solid var(--ink)",
        display: "grid",
        placeItems: "center",
        fontSize: 28,
        boxShadow: "2px 2px 0 var(--ink)",
        flexShrink: 0
      } }, shop.emoji),
      /* @__PURE__ */ React.createElement("div", { className: "shop-card-content", style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { style: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: 20,
        margin: 0,
        letterSpacing: "-0.01em"
      } }, shop.name), shop.topPick && /* @__PURE__ */ React.createElement(Tag, { bg: "var(--pop2)", ink: "#fff" }, "★ top pick"), shop.buzzy && /* @__PURE__ */ React.createElement(Tag, { bg: "var(--lime)" }, "✦ buzzy")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Space Mono', monospace", fontSize: 12, marginTop: 4, opacity: 0.7 } }, shop.address, " · ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, shop.hood)), /* @__PURE__ */ React.createElement("p", { style: {
        fontFamily: "'Nunito', sans-serif",
        fontSize: 14,
        lineHeight: 1.5,
        margin: "10px 0 0",
        color: "#2a2a2a"
      } }, shop.note)),
      /* @__PURE__ */ React.createElement("div", { className: "shop-card-meta", style: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "flex-end",
        minWidth: 0,
        width: "100%"
      } }, /* @__PURE__ */ React.createElement("span", { style: {
        background: meta.color,
        color: meta.ink,
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 11,
        padding: "5px 10px",
        borderRadius: 999,
        border: "1.5px solid var(--ink)",
        whiteSpace: "nowrap"
      } }, meta.label), /* @__PURE__ */ React.createElement("span", { className: "shop-card-hours", style: {
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        lineHeight: 1.45,
        opacity: 0.6,
        maxWidth: "100%",
        textAlign: "right",
        overflowWrap: "anywhere"
      } }, shop.price, " · ", displayHours(shop.hours)), /* @__PURE__ */ React.createElement(
        "a",
        {
          href: mapsUrl(shop),
          target: "_blank",
          rel: "noreferrer",
          onClick: (e) => e.stopPropagation(),
          style: {
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink)",
            textDecoration: "none",
            borderBottom: "1.5px solid var(--ink)"
          }
        },
        "maps ↗"
      ))
    );
  }
  function Tag({ children, bg, ink = "var(--ink)" }) {
    return /* @__PURE__ */ React.createElement("span", { style: {
      background: bg,
      color: ink,
      fontFamily: "'Space Mono', monospace",
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 999,
      border: "1.5px solid var(--ink)",
      textTransform: "uppercase",
      letterSpacing: "0.04em"
    } }, children);
  }
  function ShopDetail({ shop, onClose, C }) {
    const meta = STATUS_META[shop.status];
    useEffect(() => {
      const previousOverflow = document.body.style.overflow;
      const handleKeyDown = (event) => {
        if (event.key === "Escape") onClose();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onClose]);
    return /* @__PURE__ */ React.createElement("div", { className: "shop-detail-overlay", onClick: onClose, style: {
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "rgba(26,26,26,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      overflowY: "auto",
      overscrollBehavior: "contain",
      animation: "fadeIn 0.2s"
    } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "shop-detail",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "shop-detail-title",
        onClick: (e) => e.stopPropagation(),
        style: {
          background: "var(--bg)",
          border: "3px solid var(--ink)",
          borderRadius: 28,
          boxShadow: "10px 10px 0 var(--ink)",
          maxWidth: 540,
          width: "100%",
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          animation: "popIn 0.25s cubic-bezier(.34,1.56,.64,1)",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "shop-detail-header", style: {
        background: meta.color,
        padding: "32px 28px",
        borderBottom: "3px solid var(--ink)",
        position: "relative",
        flexShrink: 0
      } }, /* @__PURE__ */ React.createElement("button", { className: "shop-detail-close", "aria-label": "Close shop details", onClick: onClose, style: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "2.5px solid var(--ink)",
        background: "#fff",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 800,
        boxShadow: "2px 2px 0 var(--ink)"
      } }, "✕"), /* @__PURE__ */ React.createElement("div", { className: "shop-detail-icon", style: {
        width: 84,
        height: 84,
        borderRadius: "50%",
        background: "#fff",
        border: "3px solid var(--ink)",
        boxShadow: "4px 4px 0 var(--ink)",
        display: "grid",
        placeItems: "center",
        fontSize: 48,
        marginBottom: 16
      } }, shop.emoji), /* @__PURE__ */ React.createElement("h2", { id: "shop-detail-title", className: "shop-detail-title", style: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: 38,
        margin: 0,
        letterSpacing: "-0.02em",
        lineHeight: 1
      } }, shop.name), /* @__PURE__ */ React.createElement("div", { className: "shop-detail-address", style: { fontFamily: "'Space Mono', monospace", fontSize: 13, marginTop: 8 } }, shop.address, " · ", shop.hood), /* @__PURE__ */ React.createElement("div", { className: "shop-detail-tags", style: { marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: {
        background: "var(--ink)",
        color: "var(--bg)",
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        fontWeight: 700,
        padding: "5px 10px",
        borderRadius: 999
      } }, meta.label), shop.topPick && /* @__PURE__ */ React.createElement(Tag, { bg: "#fff" }, "★ top pick"), shop.buzzy && /* @__PURE__ */ React.createElement(Tag, { bg: "#fff" }, "✦ buzzy"))),
      /* @__PURE__ */ React.createElement("div", { className: "shop-detail-body", style: {
        padding: 28,
        fontFamily: "'Nunito', sans-serif",
        overflowY: "auto",
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch"
      } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Mini, { label: "hours", val: displayHours(shop.hours) }), /* @__PURE__ */ React.createElement(Mini, { label: "price", val: shop.price }), /* @__PURE__ */ React.createElement(Mini, { label: "neighborhood", val: shop.hood })), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 17, lineHeight: 1.5, margin: 0 } }, shop.note), /* @__PURE__ */ React.createElement("div", { style: {
        marginTop: 16,
        padding: 14,
        background: "#fff",
        border: "2px solid var(--ink)",
        borderRadius: 14,
        fontSize: 14,
        lineHeight: 1.5
      } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 4,
        color: meta.ink
      } }, "soy status"), shop.soyNote), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, href: mapsUrl(shop) }, "📍 directions"), /* @__PURE__ */ React.createElement(Btn, { href: shop.source }, "🔗 source"), /* @__PURE__ */ React.createElement(Btn, { href: mapsUrl(shop) }, "🗺️ google maps")))
    ));
  }
  function Mini({ label, val }) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Space Mono', monospace", fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18 } }, val));
  }
  function Btn({ children, primary, href }) {
    const style = {
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 700,
      fontSize: 14,
      padding: "10px 16px",
      borderRadius: 999,
      border: "2.5px solid var(--ink)",
      background: primary ? "var(--pop)" : "#fff",
      color: "var(--ink)",
      boxShadow: "3px 3px 0 var(--ink)",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center"
    };
    if (href) {
      return /* @__PURE__ */ React.createElement("a", { href, target: "_blank", rel: "noreferrer", style }, children);
    }
    return /* @__PURE__ */ React.createElement("button", { style }, children);
  }
  function Footer({ C }) {
    return /* @__PURE__ */ React.createElement("footer", { style: {
      borderTop: "3px solid var(--ink)",
      background: "var(--ink)",
      color: "var(--bg)",
      padding: "32px",
      textAlign: "center",
      fontFamily: "'Space Mono', monospace",
      fontSize: 13
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 800,
      fontSize: 28,
      marginBottom: 8,
      color: "var(--lime)"
    } }, "made with 🍵 in sf"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", { href: "/guides/" }, "guides"), " · ", /* @__PURE__ */ React.createElement("a", { href: "/perks/" }, "café perks"), " · ", /* @__PURE__ */ React.createElement("a", { href: "/methodology/" }, "our approach"), " · ", /* @__PURE__ */ React.createElement("a", { href: "/privacy/" }, "privacy")), /* @__PURE__ */ React.createElement("div", { style: { opacity: 0.7 } }, "sanfranciscomatcha.com · est. 2026"));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
