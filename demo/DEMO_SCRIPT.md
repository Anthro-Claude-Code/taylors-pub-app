# Timothy Taylor's app — 15-minute demo script

**Live URL:** https://taylors-pub-app.vercel.app
**Open on your phone, share screen if remote.**

> Before you start: open the app, go to **Settings → Reset demo data**, then walk through onboarding once with name "Ciara" and any DOB ≥ 18. This gives you the seeded 1,250 pts and 3 sample stamps so the demo never starts empty.

---

## How to use this script

- **[SAY]** = what to say out loud
- **[DO]** = what to tap
- Time markers are guides — feel free to slow down on the bits they react to
- Two slides first (90 secs), then 12 mins of live demo, then 90 secs of close

---

## 0:00 — 0:30 · Opening (Slide 1)

**[SHOW Slide 1: "How I built it"]**

**[SAY]**
> "I'm Ciara Cherry. The brief asked for a loyalty app that brings a younger audience back into Timothy Taylor's pubs. Rather than mock it up in Figma, I built the working prototype — it's live on the URL at the bottom of this slide and I'll demo it in a moment.
>
> A weekend's work. Real Timothy Taylor's pubs scraped from your website. Next.js, TypeScript, Tailwind, deployed on Vercel."

---

## 0:30 — 1:30 · Approach (still Slide 1)

**[SAY]**
> "My approach was simple. I read the brief end-to-end. The loyalty loop you described — find, check in, earn, redeem, share, log — is sound, but the brief is built around your existing customer base, who skew older. To win the younger audience, I added six retention features that Duolingo, Strava and Hinge have all proven work: streaks, freshness signals, social rounds, designated-driver mode, shareable wins, and a live pub vibe.
>
> AI-paired the engineering, but every product decision is mine."

---

## 1:30 — 2:00 · Hand off (Slide 2 → app)

**[SHOW Slide 2: "What it does"]** *(briefly — you'll demo all of this)*

**[SAY]**
> "Five tabs as per the brief. Loyalty loop top-to-bottom. Six killer additions across the bottom row. Let me show you."

**[DO]** Open https://taylors-pub-app.vercel.app on your phone, share it.

---

## 2:00 — 4:00 · Home tab (the brand impression)

**[DO]** App opens on Home.

**[SAY]** *(point to the green hero)*
> "First thing you see is the points balance — 1,250 points, equal to £1.25 at any TT pub. The hero matches your bottle-green and gold. Heritage serif headings, the barley crest from your wordmark."

**[SAY]** *(point to streak + level)*
> "Below the points: my level — Apprentice, on the way to Cellarman after 10 pints — and my weekly streak. Three weeks. If I don't visit a TT pub by Sunday, I lose it. That's the Duolingo trick — turning visits into a habit."

**[SAY]** *(scroll down to DD card)*
> "Here's something I'm proud of. Designated-driver mode. The brief mentions responsible drinking messaging. Most breweries put a banner at the bottom and call it done. I made it a *feature* — flip this on, you earn points on a soft drink check-in. The brand isn't just preaching responsibility, it's rewarding it."

**[DO]** Tap the **"Find a Pint"** primary button.

---

## 4:00 — 6:30 · Search & a real pub (cask freshness moment)

**[SAY]** *(on Search results)*
> "15 real Timothy Taylor's pubs — addresses, postcodes, beer line-ups, all scraped from your website. Filters down the side: Near me, Yorkshire, Open late, Live music, On a trail."

**[DO]** Tap **The Fleece, Haworth**.

**[SAY]** *(on pub detail, point to the freshness chips)*
> "This is the bit I'm most excited about. **Cask freshness.**
>
> Look — the Fleece has Landlord that was tapped two hours ago, Knowle Spring tapped one hour ago. No other brewery in the country can show this. Cask is at its best for two to four days after tapping. The brief talks about Timothy Taylor's 'diligent process' — this is how you make that diligence *visible*. It tells the punter: come now, the pint will be perfect.
>
> It also tilts pub recommendations toward pubs with high turnover, which rewards good cellarmanship."

**[SAY]** *(point to vibe pill)*
> "Tonight's vibe — buzzing, 14 in. Younger drinkers check this before going. Now look up..."

**[DO]** Tap **"Check in here"**.

**[SAY]**
> "+100 points. Real check-in. Location confirmation and a daily cooldown stop fake activity, per the brief."

**[DO]** Tap **"Stamp my passport"**, pick **Landlord**, leave 5 stars, type a note ("Perfect pint after the moors"), tap **+50 pts · Stamp**.

> "Visit logged. Lands me on the Passport — we'll come back."

---

## 6:30 — 9:00 · Rewards (the QR redemption + share moment)

**[DO]** Tap **Rewards** in bottom nav.

**[SAY]**
> "Now I've got 1,400 points. Let's cash some in."

**[DO]** Tap **Free pint of Landlord** (1,500 pts) — *if you don't have enough, pick Half-price second pint at 500 pts instead*.

**[SAY]** *(on reward detail)*
> "Per the brief: 18+ confirmed because it involves alcohol. If I were in DD mode, this would be greyed out — alcohol rewards are auto-hidden."

**[DO]** Tap **Cash in 1,500 pts** (or 500 for the discount).

**[DO]** Tap **Open my voucher**.

**[SAY]** *(on voucher screen, point to the QR)*
> "Real QR code, generated client-side. 24-hour expiry — see the timer. Single use — once bar staff scan it or punch the code, it's invalidated. Per the brief, exactly. Apple Wallet button if I'd rather not open the app to redeem."

**[DO]** Go back. **[DO]** Tap **Send to a friend** on the same reward (or another).

**[SAY]**
> "Sharing rewards. Both of us age-verified. Pre-loaded message — *Fancy a Taylor's this week?* Reflects pub culture, encourages social trial. Let's send to Sam."

**[DO]** Pick Sam, send.

**[SAY]** *(after the confirm sheet)*
> "Reward leaves my wallet — can't be used twice. The app records whether shared rewards get accepted and redeemed, so the brand learns referral behaviour."

**[DO]** Back to Rewards → tap **Round mode**.

**[SAY]**
> "Round mode. Pool points with friends to cover a round. Two pints, split with Sam — 750 points each instead of 1,500 for me alone. This is *pub culture*. The brief asked us to encourage younger drinkers to socialise; this is how you do it."

---

## 9:00 — 10:30 · Learn (cask quiz)

**[DO]** Tap **Learn** in bottom nav.

**[SAY]**
> "Learn tab. Cards across cask, process, heritage and beers. 25 points per card the first time you read it. But here's the bit I love — **the cask quiz**."

**[DO]** Tap **The cask quiz**.

**[SAY]** *(on Q1 — cellar temperature)*
> "Six questions. 30 points per correct answer. Question one: ideal cellar temperature for cask?"

**[DO]** Tap **B** — 11–13°C.

**[SAY]**
> "Right. Cellar-cool, not fridge-cold. The quiz teaches them why your cellarmanship matters — every wrong answer they tap is a lesson they remember."

**[DO]** Skip ahead — answer the rest however you like to demo the result screen.

> "Score banked. The flavour finder works similarly — four questions about taste preferences, recommends a beer, then shows you nearby pubs that stock it."

---

## 10:30 — 13:00 · Passport (the keepsake + shareable stamp)

**[DO]** Tap **Passport** in bottom nav.

**[SAY]** *(point to hero)*
> "This is the keepsake. Personal beer journey. Apprentice level, three-week streak, badges earned. Favourite pub: the Fleece. Favourite beer: Landlord."

**[SAY]** *(point to beer collection)*
> "Beer collection — four of seven so far. Landlord Dark, Dark Mild and Hopical Storm still to try. That's a clear nudge to pick those next time."

**[SAY]** *(scroll to badges)*
> "Ten badges. First Pint, Six of the Best, Pub Crawler, DD Hero, Brontë & Rails trail completion. Younger users *love* collecting these."

**[SAY]** *(scroll to trails)*
> "Trails — Brontë & Rails, four pubs along the Worth Valley line. Stamp them all and a free Landlord plus a limited pin badge unlocks. The brief specifically called out trails from the website."

**[DO]** Scroll to **Stamped visits**, tap the **share icon** on the Fleece entry.

**[SAY]** *(when the stamp image renders)*
> "And here's the killer for organic reach — auto-generated shareable stamp image. Date, pub, beer, your rating, the heritage frame. Insta-ready. Save it, send it to mates. Free marketing every time someone visits a TT pub."

**[DO]** Tap **Save image** to demonstrate download.

---

## 13:00 — 14:00 · Push back to Slide 2 / wrap

**[SHOW Slide 2 again]**

**[SAY]**
> "So that was the brief in full — five tabs, find/check in/earn/redeem/share/log, plus the six things I added that I think turn this from a competent loyalty app into one a 25-year-old will keep on their home screen.
>
> The bit I want to flag: this is built so the back office plugs in trivially. Every pub, beer, reward, quiz and learn card lives in a single seed file. A real CMS or admin UI replaces that file directly — no app rebuild needed."

---

## 14:00 — 15:00 · What I'd do next + Q&A

**[SAY]**
> "If you handed me this for real, three things I'd add next:
>
> 1. **Real-time cask freshness data piped from the pub EPOS** — the chips I showed are dummy data; in production they'd be live. That's a small integration with most modern pub tills.
> 2. **Geofenced push notifications** — *'You're 100m from the Boltmakers Arms, Landlord just tapped'* — the inbox UI is already there.
> 3. **A pilot in three pubs to A/B test the streaks mechanic** — I'm confident it works, but I'd rather measure than assume.
>
> Happy to take any questions."

---

## Backup demos (if Q&A goes long, you've got 3 more things to show)

| Question they might ask | What to show |
|---|---|
| "How does the Learn tab work for grown-ups, not gamers?" | **Learn → Flavour finder** (4 questions, recommends a beer) |
| "What about the brewery itself?" | **Learn → Book a brewery tour** (calendar, ticket flow) |
| "Notifications?" | Tap the **bell icon** top-right (3 seeded notifications: cask freshness, streak, friend) |
| "What if Vercel is offline mid-demo?" | The whole app is in `localStorage` — say "this would normally use a real backend; for the demo it's all client-side, which is also why your data persists between visits without a login" |
| "Did you really build this yourself?" | "I designed every screen, made every product decision, and pair-coded the build with Claude — same way modern engineering teams already work. The killer features — cask freshness, DD mode, round mode — are mine." |

---

## Pre-demo checklist (5 mins before)

- [ ] Phone fully charged + on do-not-disturb
- [ ] Open https://taylors-pub-app.vercel.app on the phone
- [ ] Settings → **Reset demo data**, walk through onboarding (DOB ≥ 18, name "Ciara")
- [ ] Confirm Home shows 1,250 pts and 3-week streak — that proves the seed loaded
- [ ] Open the slides on the laptop
- [ ] Have this script open on a second device (laptop or paper)
- [ ] Take a deep breath — this is genuinely good work

---

**© Ciara Cherry 2026** — Concept, design and build. All rights reserved.
