export type BeerSlug =
  | "landlord"
  | "boltmaker"
  | "golden-best"
  | "knowle-spring"
  | "landlord-dark"
  | "dark-mild"
  | "hopical-storm";

export type FlavourTag =
  | "bitter"
  | "sweet"
  | "fruity"
  | "honeyed"
  | "biscuit"
  | "roasted"
  | "hoppy"
  | "smooth"
  | "light"
  | "dark"
  | "classic"
  | "modern";

export interface Beer {
  slug: BeerSlug;
  name: string;
  abv: number;
  style: string;
  blurb: string;
  tasting: string;
  pairings: string[];
  flavours: FlavourTag[];
  pumpColour: string;
  textColour: string;
}

export type Vibe = "quiet" | "cosy" | "buzzing" | "live music";

export interface Pub {
  id: string;
  name: string;
  town: string;
  county: string;
  postcode: string;
  address: string;
  phone?: string;
  blurb: string;
  features: string[];
  beers: BeerSlug[];
  rating: number;
  ratingCount: number;
  lat: number;
  lng: number;
  vibe: Vibe;
  hoursToday: string;
  caskTapped: { beer: BeerSlug; hoursAgo: number }[];
  liveCount: number;
  trail?: string;
}

export type RewardKind =
  | "free-pint"
  | "discount"
  | "trail-stamp"
  | "draw"
  | "birthday"
  | "merch";

export interface Reward {
  id: string;
  kind: RewardKind;
  title: string;
  subtitle: string;
  cost?: number;
  pubScope?: string[];
  beerScope?: BeerSlug[];
  expires?: string;
  trail?: string;
  description: string;
  shareable: boolean;
  ageRestricted: boolean;
}

export interface LearnCard {
  id: string;
  topic: "cask" | "heritage" | "beers" | "process";
  title: string;
  body: string;
  read?: boolean;
  pointsOnRead: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { key: "A" | "B" | "C"; label: string }[];
  correct: "A" | "B" | "C";
  explanation: string;
}

export interface FlavourQuestion {
  id: string;
  prompt: string;
  options: { label: string; tags: FlavourTag[] }[];
}

export interface Trail {
  id: string;
  name: string;
  description: string;
  pubIds: string[];
  rewardId: string;
  image: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  predicate: (s: UserState) => boolean;
}

export type Level = {
  key: "apprentice" | "cellarman" | "master" | "honorary";
  name: string;
  pintsRequired: number;
  blurb: string;
};

export interface PassportEntry {
  id: string;
  pubId: string;
  beer: BeerSlug;
  date: string;
  pintRating: number;
  serviceRating: number;
  note?: string;
  ddMode?: boolean;
}

export interface CheckIn {
  id: string;
  pubId: string;
  date: string;
  ddMode: boolean;
  pointsEarned: number;
}

export interface ActiveVoucher {
  id: string;
  rewardId: string;
  code: string;
  issuedAt: string;
  expiresAt: string;
  redeemed: boolean;
  redeemedAt?: string;
  pubScope?: string[];
  fromFriend?: string;
}

export interface SharedReward {
  id: string;
  rewardId: string;
  toName: string;
  message: string;
  sentAt: string;
  accepted: boolean;
  redeemed: boolean;
}

export interface Notification {
  id: string;
  date: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
  read: boolean;
  kind: "freshness" | "streak" | "friend" | "offer" | "trail" | "system";
}

export interface UserState {
  onboarded: boolean;
  ageVerified: boolean;
  name: string;
  initial: string;
  homeArea?: string;
  points: number;
  pintsLogged: number;
  pubsVisited: string[];
  beersTried: BeerSlug[];
  streakWeeks: number;
  streakLastVisitISO?: string;
  passport: PassportEntry[];
  checkIns: CheckIn[];
  vouchers: ActiveVoucher[];
  sharedRewards: SharedReward[];
  badgesEarned: string[];
  cardsRead: string[];
  quizScores: Record<string, number>;
  flavourPrefs: FlavourTag[];
  notifications: Notification[];
  ddModeOn: boolean;
  friends: { name: string; initial: string; lastPub?: string }[];
  walletPasses: string[];
}
