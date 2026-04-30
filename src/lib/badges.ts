import type { Badge } from "./types";

export const BADGES: Badge[] = [
  {
    id: "first-pint",
    name: "First Pint",
    description: "Your very first stamp in the Passport.",
    icon: "🍺",
    predicate: (s) => s.pintsLogged >= 1,
  },
  {
    id: "five-pints",
    name: "Regular",
    description: "Five pints logged. You're getting the hang of this.",
    icon: "🪵",
    predicate: (s) => s.pintsLogged >= 5,
  },
  {
    id: "ten-pints",
    name: "Cellarman",
    description: "Ten pints. Promotion earned.",
    icon: "🛢️",
    predicate: (s) => s.pintsLogged >= 10,
  },
  {
    id: "all-cores",
    name: "Six of the Best",
    description: "Tasted all six core beers.",
    icon: "🏅",
    predicate: (s) => {
      const core = ["landlord", "boltmaker", "golden-best", "knowle-spring", "landlord-dark", "hopical-storm"];
      return core.every((c) => s.beersTried.includes(c as never));
    },
  },
  {
    id: "three-pubs",
    name: "Pub Crawler",
    description: "Three different TT pubs visited.",
    icon: "🚶",
    predicate: (s) => s.pubsVisited.length >= 3,
  },
  {
    id: "five-pubs",
    name: "Yorkshire Wanderer",
    description: "Five different TT pubs visited.",
    icon: "🧭",
    predicate: (s) => s.pubsVisited.length >= 5,
  },
  {
    id: "trail-bronte",
    name: "Brontë & Rails",
    description: "Completed the Brontë & Rails trail.",
    icon: "🚂",
    predicate: (s) => {
      const trail = ["fleece-haworth", "old-parcels-keighley", "dog-gun-oxenhope", "new-inn-cononley"];
      return trail.every((id) => s.pubsVisited.includes(id));
    },
  },
  {
    id: "streak-4",
    name: "Four-Week Streak",
    description: "Visited a TT pub four weeks running.",
    icon: "🔥",
    predicate: (s) => s.streakWeeks >= 4,
  },
  {
    id: "scholar",
    name: "Cask Scholar",
    description: "Read every Learn card.",
    icon: "📚",
    predicate: (s) => s.cardsRead.length >= 8,
  },
  {
    id: "dd-hero",
    name: "DD Hero",
    description: "First designated-driver check-in. Top of the round.",
    icon: "🚗",
    predicate: (s) => s.checkIns.some((c) => c.ddMode),
  },
];
