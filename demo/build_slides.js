// Builds a 2-slide PPTX deck for the TT app interview demo.
// Run: NODE_PATH="$(npm root -g)" node build_slides.js

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

const FA = require("react-icons/fa6");
const HI = require("react-icons/hi2");

// --- Brand palette (matching the app) ---
const C = {
  bottle: "1E4538",
  bottleDeep: "0F2419",
  bottleSoft: "2C5B48",
  cream: "F5ECD7",
  paper: "FBF6E8",
  gold: "C9A961",
  goldSoft: "E0C889",
  goldDeep: "A3853D",
  amber: "B86E1F",
  ink: "1A1B1A",
  inkSoft: "4B4F4A",
  inkMute: "7A7E76",
  line: "E2D8BF",
  white: "FFFFFF",
};

const FONT_HEAD = "Georgia";
const FONT_BODY = "Calibri";

async function iconPng(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: "#" + color, size: String(size) }),
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Tiny barley-ear SVG that mirrors the app crest, exported as PNG
async function barleyPng(color = C.gold, size = 512) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="${size}" height="${(size * 140) / 120}">
    <g stroke="#${color}" fill="none" stroke-width="2" stroke-linecap="round">
      <path d="M48 22 C 36 38 30 60 30 90"/>
      <path d="M40 38 q -10 4 -10 14"/>
      <path d="M36 50 q -10 4 -10 14"/>
      <path d="M33 64 q -10 4 -10 14"/>
      <path d="M31 78 q -10 4 -10 14"/>
      <path d="M72 22 C 84 38 90 60 90 90"/>
      <path d="M80 38 q 10 4 10 14"/>
      <path d="M84 50 q 10 4 10 14"/>
      <path d="M87 64 q 10 4 10 14"/>
      <path d="M89 78 q 10 4 10 14"/>
    </g>
    <line x1="60" y1="22" x2="60" y2="100" stroke="#${color}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="60" cy="16" rx="3.5" ry="7" fill="#${color}"/>
    <ellipse cx="50" cy="22" rx="3" ry="6" fill="#${color}" transform="rotate(-18 50 22)"/>
    <ellipse cx="70" cy="22" rx="3" ry="6" fill="#${color}" transform="rotate(18 70 22)"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function build() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.author = "Timothy Taylor's app — interview demo";
  pres.title = "Timothy Taylor's app";

  // Pre-render assets
  const barley = await barleyPng(C.gold, 256);
  const barleyDeep = await barleyPng(C.bottle, 256);

  const icons = {
    pubs: await iconPng(FA.FaBeerMugEmpty, C.gold),
    code: await iconPng(FA.FaCodeCompare, C.gold),
    mobile: await iconPng(FA.FaMobileScreenButton, C.gold),
    cloud: await iconPng(FA.FaCloud, C.gold),
    sparkle: await iconPng(HI.HiSparkles, C.gold),
    home: await iconPng(FA.FaHouse, C.bottle),
    search: await iconPng(FA.FaMagnifyingGlass, C.bottle),
    ticket: await iconPng(FA.FaTicket, C.bottle),
    book: await iconPng(FA.FaBookOpen, C.bottle),
    passport: await iconPng(FA.FaPassport, C.bottle),
    fire: await iconPng(FA.FaFire, C.amber),
    bolt: await iconPng(FA.FaBolt, C.amber),
    users: await iconPng(FA.FaUsers, C.amber),
    car: await iconPng(FA.FaCarSide, C.amber),
    glass: await iconPng(FA.FaWineGlass, C.amber),
    share: await iconPng(FA.FaShareNodes, C.amber),
  };

  // ============================
  // SLIDE 1 — How I built it
  // ============================
  const s1 = pres.addSlide();
  s1.background = { color: C.bottleDeep };

  // Decorative side band on the right
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 7.4, y: 0, w: 2.6, h: 5.625,
    fill: { color: C.bottle }, line: { color: C.bottle },
  });
  s1.addImage({ data: barley, x: 8.05, y: 0.55, w: 1.4, h: 1.633 });

  // Top eyebrow + serif title
  s1.addText("TIMOTHY TAYLOR'S APP", {
    x: 0.5, y: 0.45, w: 6.6, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, color: C.gold, charSpacing: 6, bold: true, margin: 0,
  });
  s1.addText("How I built it", {
    x: 0.5, y: 0.75, w: 6.6, h: 0.9,
    fontSize: 44, fontFace: FONT_HEAD, color: C.cream, italic: true, margin: 0,
  });

  // Subtitle line
  s1.addText("A weekend project, real data, shipped to production.", {
    x: 0.5, y: 1.7, w: 6.6, h: 0.35,
    fontSize: 14, fontFace: FONT_BODY, color: C.goldSoft, italic: true, margin: 0,
  });

  // Process steps as 4 numbered cards (left half)
  const steps = [
    { num: "01", title: "Read the brief, mapped the loop", body: "Find → check in → earn → redeem → share → log. Brief is sound, but built for older drinkers." },
    { num: "02", title: "Identified what was missing", body: "Six retention features younger users expect: streaks, freshness, social rounds, DD mode." },
    { num: "03", title: "Designed in TT's brand world", body: "Heritage palette, serif headings, barley crest. Mobile-first so it feels like the real app." },
    { num: "04", title: "AI-paired the build, shipped live", body: "Next.js 16 · TypeScript · Tailwind. 15 real TT pubs. Live URL on Vercel — see footer." },
  ];

  const stepX = 0.5;
  let y = 2.2;
  steps.forEach((step) => {
    // Number column (gold)
    s1.addText(step.num, {
      x: stepX, y, w: 0.55, h: 0.55,
      fontSize: 24, fontFace: FONT_HEAD, color: C.gold, italic: true, margin: 0,
    });
    // Vertical hairline
    s1.addShape(pres.shapes.RECTANGLE, {
      x: stepX + 0.62, y: y + 0.05, w: 0.015, h: 0.55,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    // Title
    s1.addText(step.title, {
      x: stepX + 0.78, y: y - 0.02, w: 6.2, h: 0.32,
      fontSize: 14, fontFace: FONT_BODY, color: C.cream, bold: true, margin: 0,
    });
    s1.addText(step.body, {
      x: stepX + 0.78, y: y + 0.28, w: 6.2, h: 0.4,
      fontSize: 11, fontFace: FONT_BODY, color: C.goldSoft, margin: 0,
    });
    y += 0.7;
  });

  // Stack chips (right column under barley)
  const chipY = 2.5;
  const chips = [
    { label: "Next.js 16", icon: icons.code },
    { label: "TypeScript", icon: icons.code },
    { label: "Tailwind CSS", icon: icons.mobile },
    { label: "Vercel", icon: icons.cloud },
  ];
  chips.forEach((c, i) => {
    const cy = chipY + i * 0.5;
    s1.addShape(pres.shapes.RECTANGLE, {
      x: 7.7, y: cy, w: 2.0, h: 0.4,
      fill: { color: C.bottleDeep }, line: { color: C.gold, width: 0.5 },
    });
    s1.addImage({ data: c.icon, x: 7.85, y: cy + 0.08, w: 0.24, h: 0.24 });
    s1.addText(c.label, {
      x: 8.18, y: cy + 0.04, w: 1.5, h: 0.32,
      fontSize: 11, fontFace: FONT_BODY, color: C.cream, bold: true, valign: "middle", margin: 0,
    });
  });

  // Footer band (gold hairline + URL)
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.13, w: 7.4, h: 0.01,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s1.addText([
    { text: "LIVE", options: { color: C.gold, bold: true, charSpacing: 3 } },
    { text: "  ·  ", options: { color: C.gold } },
    { text: "taylors-pub-app.vercel.app", options: { color: C.cream } },
  ], {
    x: 0.5, y: 5.22, w: 4, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, valign: "middle", margin: 0,
  });
  s1.addText("Concept · design · build  ·  Ciara Cherry  ·  © 2026", {
    x: 3.8, y: 5.22, w: 3.5, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: C.goldSoft, italic: true, align: "right", margin: 0,
  });

  // ============================
  // SLIDE 2 — What it does
  // ============================
  const s2 = pres.addSlide();
  s2.background = { color: C.paper };

  // Subtle paper-feel band on the right
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.18,
    fill: { color: C.bottle }, line: { color: C.bottle },
  });

  // Title block
  s2.addText("WHAT IT DOES", {
    x: 0.5, y: 0.4, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, color: C.goldDeep, charSpacing: 6, bold: true, margin: 0,
  });
  s2.addText("The brief, met in full — and a little more.", {
    x: 0.5, y: 0.7, w: 9, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: C.bottle, italic: true, margin: 0,
  });

  // Five tabs row (per the brief)
  const tabs = [
    { name: "Home", icon: icons.home, body: "Points, streak, level, primary CTA" },
    { name: "Search", icon: icons.search, body: "15 real TT pubs. Vibe + freshness." },
    { name: "Rewards", icon: icons.ticket, body: "QR vouchers · 1,000 pts = £1 · share" },
    { name: "Learn", icon: icons.book, body: "Cards, cask quiz, flavour finder" },
    { name: "Passport", icon: icons.passport, body: "Stamps, badges, shareable image" },
  ];
  tabs.forEach((t, i) => {
    const x = 0.5 + i * 1.85;
    s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.55, w: 1.7, h: 1.55,
      fill: { color: C.white }, line: { color: C.line, width: 0.75 },
      rectRadius: 0.12,
      shadow: { type: "outer", color: "0F2419", blur: 6, offset: 1, angle: 90, opacity: 0.06 },
    });
    s2.addImage({ data: t.icon, x: x + 0.65, y: 1.7, w: 0.4, h: 0.4 });
    s2.addText(t.name, {
      x, y: 2.18, w: 1.7, h: 0.3,
      fontSize: 14, fontFace: FONT_HEAD, color: C.bottle, bold: true, align: "center", margin: 0,
    });
    s2.addText(t.body, {
      x: x + 0.1, y: 2.5, w: 1.5, h: 0.6,
      fontSize: 9.5, fontFace: FONT_BODY, color: C.inkSoft, align: "center", margin: 0,
    });
  });

  // Brief loop tagline
  s2.addText([
    { text: "THE LOYALTY LOOP   ", options: { color: C.goldDeep, bold: true, charSpacing: 4, fontSize: 9 } },
    { text: "Find a pub  →  Check in  →  Earn pts  →  Learn or quiz  →  Redeem by QR  →  Share  →  Stamp passport", options: { color: C.bottleSoft, italic: true, fontSize: 11 } },
  ], {
    x: 0.5, y: 3.3, w: 9, h: 0.4,
    fontFace: FONT_BODY, valign: "middle", margin: 0,
  });

  // "What I added beyond the brief" — header
  s2.addText("WHAT I ADDED BEYOND THE BRIEF", {
    x: 0.5, y: 3.85, w: 9, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: C.amber, charSpacing: 4, bold: true, margin: 0,
  });

  // Six killer additions in a 6-up row
  const adds = [
    { name: "Streaks & levels", icon: icons.fire, body: "Weekly visit streak. Apprentice → Master Cellarman." },
    { name: "Cask freshness", icon: icons.bolt, body: "“Landlord tapped 2h ago.” Unique to cask. TT-defining." },
    { name: "Round mode", icon: icons.users, body: "Pool points with friends to cover a round." },
    { name: "DD mode", icon: icons.car, body: "Earn points on soft drinks. Responsibility, rewarded." },
    { name: "Shareable stamp", icon: icons.share, body: "Auto-generated Insta image after every visit." },
    { name: "Live vibe + friends", icon: icons.glass, body: "“Buzzing · 14 in.” See when mates check in nearby." },
  ];
  adds.forEach((a, i) => {
    const x = 0.5 + i * 1.55;
    s2.addImage({ data: a.icon, x: x + 0.05, y: 4.2, w: 0.3, h: 0.3 });
    s2.addText(a.name, {
      x: x + 0.42, y: 4.18, w: 1.15, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: C.bottle, bold: true, margin: 0,
    });
    s2.addText(a.body, {
      x: x + 0.05, y: 4.5, w: 1.45, h: 0.55,
      fontSize: 8.5, fontFace: FONT_BODY, color: C.inkSoft, margin: 0,
    });
  });

  // Bottom band: stat strip + URL
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fill: { color: C.bottle }, line: { color: C.bottle },
  });
  const statText = [
    { text: "15 ", options: { color: C.gold, bold: true } },
    { text: "real pubs   ·   ", options: { color: C.cream } },
    { text: "7 ", options: { color: C.gold, bold: true } },
    { text: "TT beers   ·   ", options: { color: C.cream } },
    { text: "10 ", options: { color: C.gold, bold: true } },
    { text: "badges   ·   ", options: { color: C.cream } },
    { text: "8 ", options: { color: C.gold, bold: true } },
    { text: "rewards   ·   ", options: { color: C.cream } },
    { text: "1 ", options: { color: C.gold, bold: true } },
    { text: "trail (Brontë & Rails)", options: { color: C.cream } },
  ];
  s2.addText(statText, {
    x: 0.5, y: 5.32, w: 6.4, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, valign: "middle", margin: 0,
  });
  s2.addText("taylors-pub-app.vercel.app   ·   © Ciara Cherry 2026", {
    x: 5.4, y: 5.32, w: 4.1, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: C.goldSoft, italic: true, align: "right", valign: "middle", margin: 0,
  });

  await pres.writeFile({ fileName: "Taylors_Demo_Slides.pptx" });
  console.log("Wrote Taylors_Demo_Slides.pptx");
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
