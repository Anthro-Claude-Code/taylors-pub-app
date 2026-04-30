# Timothy Taylor's app

A mobile-first loyalty app concept for Timothy Taylor's brewery — find a pub,
earn points, learn about cask ale, stamp your beer passport, share rewards
with friends.

**Live demo:** https://taylors-pub-app.vercel.app

---

## Author & IP

**© Ciara Cherry 2026 — All rights reserved.**

Concept, product design, visual design and build by Ciara Cherry. The
project was developed as a portfolio piece for a graduate role at
Timothy Taylor's & Co. Ltd. The Timothy Taylor's name, pub names and beer
names referenced are used in their publicly known form solely to
demonstrate the prototype in its intended context, and remain the
property of Timothy Taylor's & Co. Ltd.

See [`LICENSE`](./LICENSE) for full terms. For licensing enquiries,
contact the copyright holder.

---

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first @theme palette)
- Playfair Display (heritage serif headings) + Inter (body)
- Client-side state in `localStorage` (no backend required for the demo)
- Deployed on Vercel

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    onboarding/        — age gate + welcome
    (app)/             — five tabs in the bottom nav
      home/
      search/
      rewards/
      learn/
      passport/
      notifications/   — push-style inbox
      settings/
      trails/[id]/
  components/          — UI building blocks
  lib/
    seed.ts            — pubs, beers, rewards, learn cards, quizzes
    state.tsx          — context + localStorage hook
    badges.ts          — unlock predicates
    types.ts
```
