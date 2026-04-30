// Build the Word version of the demo script.
// Run: NODE_PATH="$(npm root -g)" node build_script_doc.js

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, ExternalHyperlink, PageBreak, PageNumber, Footer, Header,
  TabStopType, TabStopPosition,
} = require("docx");

// Brand
const BOTTLE = "1E4538";
const BOTTLE_DEEP = "0F2419";
const GOLD = "A3853D";
const AMBER = "B86E1F";
const INK = "1A1B1A";
const INK_SOFT = "4B4F4A";
const INK_MUTE = "7A7E76";
const CREAM = "FBF6E8";
const PAPER = "FBF6E8";
const SAY_BG = "F5ECD7"; // cream for [SAY] blockquotes
const DO_BG = "EAF1EC";  // soft green for [DO]
const STEP0_BG = "FBE9DC"; // amber-tinted for the STEP 0 box

const FONT = "Calibri";
const FONT_HEAD = "Georgia";

// --- Helpers ---
const p = (children, opts = {}) => new Paragraph({ children, ...opts });
const r = (text, opts = {}) => new TextRun({ text, font: FONT, ...opts });
const rh = (text, opts = {}) => new TextRun({ text, font: FONT_HEAD, ...opts });

function spacer(after = 80) {
  return new Paragraph({ spacing: { after }, children: [new TextRun("")] });
}

function rule(color = "C9A961") {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    children: [new TextRun("")],
  });
}

function bulletItem(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: FONT, size: 22, ...opts })],
  });
}

function tickItem(text) {
  // We use a heavy ballot-box symbol, then the text — Word renders this cleanly
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 280, hanging: 280 },
    children: [
      new TextRun({ text: "☐  ", font: "Cambria", size: 24, color: BOTTLE, bold: true }),
      new TextRun({ text, font: FONT, size: 22, color: INK }),
    ],
  });
}

function sectionTitle(time, body) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({ text: time + "  ·  ", font: FONT_HEAD, color: GOLD, size: 22, bold: true }),
      new TextRun({ text: body, font: FONT_HEAD, color: BOTTLE, size: 28, bold: true }),
    ],
  });
}

function smallEyebrow(text, color = GOLD) {
  return new Paragraph({
    spacing: { before: 60, after: 20 },
    children: [new TextRun({ text: text.toUpperCase(), font: FONT, size: 16, color, bold: true, characterSpacing: 60 })],
  });
}

// Quote box (single-cell table) for [SAY] blockquotes
function sayBox(lines) {
  // lines: array of strings; a single quote block
  const paras = lines.map((line, i) => new Paragraph({
    spacing: { after: i === lines.length - 1 ? 0 : 80 },
    children: [
      new TextRun({ text: i === 0 ? '“' : "", font: FONT_HEAD, color: GOLD, size: 28, bold: true }),
      new TextRun({ text: line, font: FONT, size: 22, color: INK, italics: true }),
      new TextRun({ text: i === lines.length - 1 ? ' ”' : "", font: FONT_HEAD, color: GOLD, size: 28, bold: true }),
    ],
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: GOLD },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: SAY_BG, type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 280, right: 240 },
      children: paras,
    })] })],
  });
}

// [DO] box — green tint, single line(s)
function doBox(lines) {
  const items = (Array.isArray(lines) ? lines : [lines]);
  const paras = items.map((line, i) => new Paragraph({
    spacing: { after: i === items.length - 1 ? 0 : 60 },
    children: [
      new TextRun({ text: "▶  ", font: "Calibri", size: 22, color: BOTTLE, bold: true }),
      new TextRun({ text: line, font: FONT, size: 22, color: INK }),
    ],
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: BOTTLE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: DO_BG, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 280, right: 240 },
      children: paras,
    })] })],
  });
}

// Step 0 — big amber-tinted box
function step0Box(items) {
  const heading = new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: "⚠  ", font: "Calibri", size: 28, color: AMBER, bold: true }),
      new TextRun({ text: "STEP 0 — Do this 5 minutes before you walk in", font: FONT_HEAD, size: 28, color: BOTTLE_DEEP, bold: true }),
    ],
  });
  const sub = new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "This is the most important step. If you skip it the app will look empty.", font: FONT, size: 22, color: INK, italics: true }),
    ],
  });
  const tickParas = items.map(text => new Paragraph({
    spacing: { after: 80 },
    indent: { left: 280, hanging: 280 },
    children: [
      new TextRun({ text: "☐  ", font: "Cambria", size: 24, color: BOTTLE, bold: true }),
      new TextRun({ text, font: FONT, size: 22, color: INK }),
    ],
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 16, color: AMBER },
      bottom: { style: BorderStyle.SINGLE, size: 16, color: AMBER },
      left: { style: BorderStyle.SINGLE, size: 16, color: AMBER },
      right: { style: BorderStyle.SINGLE, size: 16, color: AMBER },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: STEP0_BG, type: ShadingType.CLEAR },
      margins: { top: 280, bottom: 280, left: 320, right: 320 },
      children: [heading, sub, ...tickParas],
    })] })],
  });
}

// Backup table (Q&A)
function qaTable(rows) {
  const header = new TableRow({
    tableHeader: true,
    children: ["If they ask…", "Show this"].map((text, i) => new TableCell({
      width: { size: i === 0 ? 4400 : 4960, type: WidthType.DXA },
      shading: { fill: BOTTLE, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [new Paragraph({
        children: [new TextRun({ text, font: FONT, size: 20, color: CREAM, bold: true })],
      })],
    })),
  });
  const dataRows = rows.map((row, idx) => new TableRow({
    children: row.map((cell, i) => new TableCell({
      width: { size: i === 0 ? 4400 : 4960, type: WidthType.DXA },
      shading: { fill: idx % 2 === 0 ? "FBF6E8" : "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: FONT, size: 20, color: INK })],
      })],
    })),
  }));
  const border = { style: BorderStyle.SINGLE, size: 4, color: "D8D2BB" };
  const allBorders = { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4400, 4960],
    borders: allBorders,
    rows: [header, ...dataRows],
  });
}

// --- Build content ---

const children = [];

// Title block
children.push(new Paragraph({
  spacing: { before: 0, after: 60 },
  children: [new TextRun({ text: "TIMOTHY TAYLOR'S APP", font: FONT, size: 18, color: GOLD, bold: true, characterSpacing: 80 })],
}));
children.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: "15-minute demo script", font: FONT_HEAD, size: 48, color: BOTTLE_DEEP, bold: true })],
}));
children.push(new Paragraph({
  spacing: { after: 200 },
  children: [
    new TextRun({ text: "Live URL:  ", font: FONT, size: 22, color: INK_SOFT, bold: true }),
    new ExternalHyperlink({
      children: [new TextRun({ text: "https://taylors-pub-app.vercel.app", font: FONT, size: 22, color: BOTTLE, bold: true, underline: { type: "single", color: BOTTLE } })],
      link: "https://taylors-pub-app.vercel.app",
    }),
    new TextRun({ text: "     ·     Open on your phone, share screen if remote.", font: FONT, size: 22, color: INK_SOFT, italics: true }),
  ],
}));

children.push(rule());

// STEP 0
children.push(step0Box([
  "Open https://taylors-pub-app.vercel.app on your phone",
  "If you've used the app before: tap the profile circle (top right) → Settings → Reset demo data → confirm",
  "Walk through onboarding: tap Get started → enter any DOB ≥ 18 (e.g. 1 Jan 2000) → Continue",
  "Type your name Ciara → Continue → Pour me a pint",
  "You should now be on Home showing 1,250 pts and a 3-week streak — that proves the seed loaded ✅",
  "Phone fully charged + on do-not-disturb",
  "Slides open on the laptop, this script open on a second device (or printed)",
  "Take a deep breath — this is genuinely good work",
]));

children.push(spacer(120));
children.push(rule());

// How to use
children.push(smallEyebrow("How to use this script"));
children.push(new Paragraph({
  spacing: { after: 80 },
  children: [
    new TextRun({ text: "“", font: FONT_HEAD, color: GOLD, size: 22, bold: true }),
    new TextRun({ text: "[SAY]", font: FONT, size: 22, color: BOTTLE, bold: true }),
    new TextRun({ text: " in a cream box  =  what to say out loud, more or less verbatim.", font: FONT, size: 22, color: INK }),
  ],
}));
children.push(new Paragraph({
  spacing: { after: 80 },
  children: [
    new TextRun({ text: "▶  ", font: FONT, size: 22, color: BOTTLE, bold: true }),
    new TextRun({ text: "[DO]", font: FONT, size: 22, color: BOTTLE, bold: true }),
    new TextRun({ text: " in a green box  =  what to tap on the phone.", font: FONT, size: 22, color: INK }),
  ],
}));
children.push(new Paragraph({
  spacing: { after: 200 },
  children: [
    new TextRun({ text: "Time markers are guides — slow down on the bits they react to.", font: FONT, size: 22, color: INK }),
  ],
}));

children.push(rule());

// === SECTIONS ===

// 0:00 — 0:30 Opening (Slide 1)
children.push(sectionTitle("0:00 — 0:30", "Opening (Slide 1)"));
children.push(doBox(["Show Slide 1: How I built it"]));
children.push(spacer(100));
children.push(sayBox([
  "I'm Ciara Cherry. The brief asked for a loyalty app that brings a younger audience back into Timothy Taylor's pubs. Rather than mock it up in Figma, I built the working prototype — it's live on the URL at the bottom of this slide and I'll demo it in a moment.",
  "A weekend's work. Real Timothy Taylor's pubs scraped from your website. Next.js, TypeScript, Tailwind, deployed on Vercel.",
]));

// 0:30 — 1:30 Approach
children.push(sectionTitle("0:30 — 1:30", "Approach (still Slide 1)"));
children.push(sayBox([
  "My approach was simple. I read the brief end-to-end. The loyalty loop you described — find, check in, earn, redeem, share, log — is sound, but the brief is built around your existing customer base, who skew older. To win the younger audience, I added six retention features that Duolingo, Strava and Hinge have all proven work: streaks, freshness signals, social rounds, designated-driver mode, shareable wins, and a live pub vibe.",
  "AI-paired the engineering, but every product decision is mine.",
]));

// 1:30 — 2:00 Hand off
children.push(sectionTitle("1:30 — 2:00", "Hand off (Slide 2 → app)"));
children.push(doBox(["Show Slide 2: What it does (briefly — you'll demo all of this)"]));
children.push(spacer(80));
children.push(sayBox([
  "Five tabs as per the brief. Loyalty loop top to bottom. Six killer additions across the bottom row. Let me show you.",
]));
children.push(spacer(60));
children.push(doBox(["Open https://taylors-pub-app.vercel.app on your phone, share it"]));

// 2:00 — 4:00 Home
children.push(sectionTitle("2:00 — 4:00", "Home tab (the brand impression)"));
children.push(doBox(["App opens on Home"]));
children.push(spacer(80));
children.push(sayBox([
  "First thing you see is the points balance — 1,250 points, equal to £1.25 at any TT pub. The hero matches your bottle-green and gold. Heritage serif headings, the barley crest from your wordmark.",
]));
children.push(sayBox([
  "Below the points: my level — Apprentice, on the way to Cellarman after 10 pints — and my weekly streak. Three weeks. If I don't visit a TT pub by Sunday, I lose it. That's the Duolingo trick — turning visits into a habit.",
]));
children.push(doBox(["Scroll down to the DD-mode card"]));
children.push(spacer(60));
children.push(sayBox([
  "Here's something I'm proud of. Designated-driver mode. The brief mentions responsible drinking messaging. Most breweries put a banner at the bottom and call it done. I made it a feature — flip this on, you earn points on a soft drink check-in. The brand isn't just preaching responsibility, it's rewarding it.",
]));
children.push(doBox(["Tap the Find a Pint button"]));

// 4:00 — 6:30 Search
children.push(sectionTitle("4:00 — 6:30", "Search & a real pub (cask freshness moment)"));
children.push(sayBox([
  "15 real Timothy Taylor's pubs — addresses, postcodes, beer line-ups, all scraped from your website. Filters across the top: Near me, Yorkshire, Open late, Live music, On a trail.",
]));
children.push(doBox(["Tap The Fleece, Haworth"]));
children.push(spacer(60));
children.push(sayBox([
  "This is the bit I'm most excited about. Cask freshness.",
  "Look — the Fleece has Landlord that was tapped two hours ago, Knowle Spring tapped one hour ago. No other brewery in the country can show this. Cask is at its best for two to four days after tapping. The brief talks about Timothy Taylor's diligent process — this is how you make that diligence visible. It tells the punter: come now, the pint will be perfect.",
  "It also tilts pub recommendations toward pubs with high turnover, which rewards good cellarmanship.",
]));
children.push(sayBox([
  "Tonight's vibe — buzzing, 14 in. Younger drinkers check this before going. Now look up…",
]));
children.push(doBox(["Tap Check in here", "+100 points lands. Then tap Stamp my passport, pick Landlord, leave 5 stars, type a note (Perfect pint after the moors), tap +50 pts · Stamp"]));
children.push(spacer(60));
children.push(sayBox([
  "Visit logged. Lands me on the Passport — we'll come back to it.",
]));

// 6:30 — 9:00 Rewards
children.push(sectionTitle("6:30 — 9:00", "Rewards (the QR redemption + share moment)"));
children.push(doBox(["Tap Rewards in bottom nav"]));
children.push(spacer(60));
children.push(sayBox(["Now I've got 1,400 points. Let's cash some in."]));
children.push(doBox(["Tap Free pint of Landlord (1,500 pts). If short of points, pick Half-price second pint (500 pts) instead"]));
children.push(spacer(60));
children.push(sayBox([
  "Per the brief: 18+ confirmed because it involves alcohol. If I were in DD mode, this would be greyed out — alcohol rewards are auto-hidden.",
]));
children.push(doBox(["Tap Cash in points → Open my voucher"]));
children.push(spacer(60));
children.push(sayBox([
  "Real QR code, generated client-side. 24-hour expiry — see the timer. Single use — once bar staff scan it or punch the code, it's invalidated. Per the brief, exactly. Apple Wallet button if I'd rather not open the app to redeem.",
]));
children.push(doBox(["Go back. Tap Send to a friend on the same reward (or another shareable one)"]));
children.push(spacer(60));
children.push(sayBox([
  "Sharing rewards. Both of us age-verified. Pre-loaded message — Fancy a Taylor's this week? Reflects pub culture, encourages social trial. Let's send to Sam.",
]));
children.push(doBox(["Pick Sam, send"]));
children.push(spacer(60));
children.push(sayBox([
  "Reward leaves my wallet — can't be used twice. The app records whether shared rewards get accepted and redeemed, so the brand learns referral behaviour.",
]));
children.push(doBox(["Back to Rewards → tap Round mode"]));
children.push(spacer(60));
children.push(sayBox([
  "Round mode. Pool points with friends to cover a round. Two pints, split with Sam — 750 points each instead of 1,500 for me alone. This is pub culture. The brief asked us to encourage younger drinkers to socialise; this is how you do it.",
]));

// 9:00 — 10:30 Learn
children.push(sectionTitle("9:00 — 10:30", "Learn (cask quiz)"));
children.push(doBox(["Tap Learn in bottom nav"]));
children.push(spacer(60));
children.push(sayBox([
  "Learn tab. Cards across cask, process, heritage and beers. 25 points per card the first time you read it. But here's the bit I love — the cask quiz.",
]));
children.push(doBox(["Tap The cask quiz"]));
children.push(spacer(60));
children.push(sayBox([
  "Six questions. 30 points per correct answer. Question one: ideal cellar temperature for cask?",
]));
children.push(doBox(["Tap B — 11–13°C"]));
children.push(spacer(60));
children.push(sayBox([
  "Right. Cellar-cool, not fridge-cold. The quiz teaches them why your cellarmanship matters — every wrong answer they tap is a lesson they remember.",
]));
children.push(doBox(["Skip ahead — answer the rest however to demo the result screen"]));
children.push(spacer(60));
children.push(sayBox([
  "Score banked. The flavour finder works similarly — four questions about taste preferences, recommends a beer, then shows you nearby pubs that stock it.",
]));

// 10:30 — 13:00 Passport
children.push(sectionTitle("10:30 — 13:00", "Passport (the keepsake + shareable stamp)"));
children.push(doBox(["Tap Passport in bottom nav"]));
children.push(spacer(60));
children.push(sayBox([
  "This is the keepsake. Personal beer journey. Apprentice level, three-week streak, badges earned. Favourite pub: the Fleece. Favourite beer: Landlord.",
]));
children.push(sayBox([
  "Beer collection — four of seven so far. Landlord Dark, Dark Mild and Hopical Storm still to try. That's a clear nudge to pick those next time.",
]));
children.push(sayBox([
  "Ten badges. First Pint, Six of the Best, Pub Crawler, DD Hero, Brontë & Rails trail completion. Younger users love collecting these.",
]));
children.push(sayBox([
  "Trails — Brontë & Rails, four pubs along the Worth Valley line. Stamp them all and a free Landlord plus a limited pin badge unlocks. The brief specifically called out trails from the website.",
]));
children.push(doBox(["Scroll to Stamped visits, tap the share icon on the Fleece entry"]));
children.push(spacer(60));
children.push(sayBox([
  "And here's the killer for organic reach — auto-generated shareable stamp image. Date, pub, beer, your rating, the heritage frame. Insta-ready. Save it, send it to mates. Free marketing every time someone visits a TT pub.",
]));
children.push(doBox(["Tap Save image to demonstrate download"]));

// 13:00 — 14:00 Wrap
children.push(sectionTitle("13:00 — 14:00", "Wrap (back to Slide 2)"));
children.push(doBox(["Show Slide 2 again"]));
children.push(spacer(60));
children.push(sayBox([
  "So that was the brief in full — five tabs, find/check in/earn/redeem/share/log, plus the six things I added that I think turn this from a competent loyalty app into one a 25-year-old will keep on their home screen.",
  "The bit I want to flag: this is built so the back office plugs in trivially. Every pub, beer, reward, quiz and learn card lives in a single seed file. A real CMS or admin UI replaces that file directly — no app rebuild needed.",
]));

// 14:00 — 15:00
children.push(sectionTitle("14:00 — 15:00", "What I'd do next + Q&A"));
children.push(sayBox([
  "If you handed me this for real, three things I'd add next:",
  "One. Real-time cask freshness data piped from the pub EPOS — the chips I showed are dummy data; in production they'd be live. That's a small integration with most modern pub tills.",
  "Two. Geofenced push notifications — You're 100m from the Boltmakers Arms, Landlord just tapped — the inbox UI is already there.",
  "Three. A pilot in three pubs to A/B test the streaks mechanic — I'm confident it works, but I'd rather measure than assume.",
  "Happy to take any questions.",
]));

children.push(spacer(160));
children.push(rule());

// Backup demos
children.push(smallEyebrow("Backup demos — if Q&A goes long, you've got more to show"));
children.push(spacer(80));
children.push(qaTable([
  ["“How does the Learn tab work for grown-ups, not gamers?”", "Learn → Flavour finder (4 Qs, recommends a beer)"],
  ["“What about the brewery itself?”", "Learn → Book a brewery tour (calendar, ticket flow)"],
  ["“Notifications?”", "Tap the bell icon top-right (3 seeded notifications)"],
  ["“What if Vercel is offline mid-demo?”", "Whole app is in localStorage — works offline because there's no real backend yet."],
  ["“Did you really build this yourself?”", "I designed every screen, made every product decision, and pair-coded the build with Claude — same way modern engineering teams already work. The killer features — cask freshness, DD mode, round mode — are mine."],
]));

children.push(spacer(200));
children.push(rule());

// Footer line
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 120 },
  children: [
    new TextRun({ text: "© Ciara Cherry 2026 — Concept, design and build. All rights reserved.", font: FONT, size: 18, color: INK_MUTE, italics: true }),
  ],
}));

// --- Document ---

const doc = new Document({
  creator: "Ciara Cherry",
  title: "Timothy Taylor's app — 15-minute demo script",
  description: "© Ciara Cherry 2026 — All rights reserved.",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 280 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Timothy Taylor's app  ·  Demo script  ·  © Ciara Cherry 2026", font: FONT, size: 16, color: INK_MUTE, italics: true }),
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9A961", space: 4 } },
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "taylors-pub-app.vercel.app", font: FONT, size: 16, color: BOTTLE, bold: true }),
            new TextRun({ text: "\tPage ", font: FONT, size: 16, color: INK_MUTE }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: INK_MUTE }),
            new TextRun({ text: " of ", font: FONT, size: 16, color: INK_MUTE }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: INK_MUTE }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Taylors_Demo_Script.docx", buffer);
  console.log("Wrote Taylors_Demo_Script.docx");
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
