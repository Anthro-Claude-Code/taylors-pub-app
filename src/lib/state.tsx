"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { UserState, PassportEntry, BeerSlug, ActiveVoucher, SharedReward, Notification } from "./types";
import { BADGES } from "./badges";
import { rewardById, FRIENDS_SEED, beerBySlug } from "./seed";

const STORAGE_KEY = "tt-app-state-v1";

const DEFAULT_STATE: UserState = {
  onboarded: false,
  ageVerified: false,
  name: "",
  initial: "?",
  homeArea: "",
  points: 0,
  pintsLogged: 0,
  pubsVisited: [],
  beersTried: [],
  streakWeeks: 0,
  streakLastVisitISO: undefined,
  passport: [],
  checkIns: [],
  vouchers: [],
  sharedRewards: [],
  badgesEarned: [],
  cardsRead: [],
  quizScores: {},
  flavourPrefs: [],
  notifications: [],
  ddModeOn: false,
  friends: FRIENDS_SEED,
  walletPasses: [],
};

/* Demo seed: makes the first run feel populated rather than empty */
const demoSeed = (): Partial<UserState> => {
  const today = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };
  const passport: PassportEntry[] = [
    {
      id: "seed-1",
      pubId: "fleece-haworth",
      beer: "landlord",
      date: daysAgo(2),
      pintRating: 5,
      serviceRating: 5,
      note: "Walked the moors, finished here. Perfect Landlord.",
    },
    {
      id: "seed-2",
      pubId: "woolly-sheep-skipton",
      beer: "boltmaker",
      date: daysAgo(9),
      pintRating: 5,
      serviceRating: 4,
    },
    {
      id: "seed-3",
      pubId: "boltmakers-arms-keighley",
      beer: "knowle-spring",
      date: daysAgo(14),
      pintRating: 4,
      serviceRating: 5,
      note: "Quiz Tuesday. Came second.",
    },
  ];
  const notifications: Notification[] = [
    {
      id: "n-1",
      date: daysAgo(0),
      title: "Landlord, freshly tapped",
      body: "A new cask of Landlord was tapped at The Fleece, Haworth, 2 hours ago.",
      kind: "freshness",
      cta: { label: "Find the Fleece", href: "/search/fleece-haworth" },
      read: false,
    },
    {
      id: "n-2",
      date: daysAgo(1),
      title: "Streak in progress",
      body: "You're on a 3-week streak. Visit any TT pub by Sunday to keep it alive.",
      kind: "streak",
      read: false,
    },
    {
      id: "n-3",
      date: daysAgo(2),
      title: "Sam checked in at The Fleece",
      body: "Your friend Sam just checked in. Fancy joining?",
      kind: "friend",
      read: true,
    },
  ];
  return {
    points: 1250,
    pintsLogged: 3,
    pubsVisited: ["fleece-haworth", "woolly-sheep-skipton", "boltmakers-arms-keighley"],
    beersTried: ["landlord", "boltmaker", "knowle-spring"],
    streakWeeks: 3,
    streakLastVisitISO: daysAgo(2),
    passport,
    notifications,
    cardsRead: ["heritage-1"],
  };
};

interface StateAPI {
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState>>;
  hydrated: boolean;
  reset: () => void;
  completeOnboarding: (name: string, ageVerified: boolean) => void;
  toggleDDMode: (v?: boolean) => void;
  checkIn: (pubId: string, opts?: { ddMode?: boolean }) => { points: number; alreadyToday: boolean };
  logPassportEntry: (e: Omit<PassportEntry, "id" | "date"> & { date?: string }) => string;
  markCardRead: (cardId: string) => void;
  setQuizScore: (quizId: string, correct: number, total: number) => number;
  setFlavourPrefs: (prefs: UserState["flavourPrefs"]) => void;
  redeemReward: (rewardId: string, fromVoucherId?: string) => ActiveVoucher | null;
  voucherRedeem: (voucherId: string) => boolean;
  shareReward: (rewardId: string, toName: string, message: string) => SharedReward | null;
  markNotificationRead: (id: string) => void;
  pushNotification: (n: Omit<Notification, "id" | "date" | "read">) => void;
  earnedBadges: () => string[];
  newlyEarnedBadges: () => string[];
  walletAdd: (voucherId: string) => void;
}

const Ctx = createContext<StateAPI | null>(null);

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const completeOnboarding = useCallback((name: string, ageVerified: boolean) => {
    setState((s) => ({
      ...s,
      ...demoSeed(),
      onboarded: true,
      ageVerified,
      name,
      initial: name?.[0]?.toUpperCase() || "?",
    }));
  }, []);

  const toggleDDMode = useCallback((v?: boolean) => {
    setState((s) => ({ ...s, ddModeOn: typeof v === "boolean" ? v : !s.ddModeOn }));
  }, []);

  const computeStreakWeeks = (currentWeeks: number, lastISO: string | undefined, nowISO: string) => {
    if (!lastISO) return 1;
    const last = new Date(lastISO);
    const now = new Date(nowISO);
    const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      const diffWeek = Math.floor(diffDays / 7);
      return diffWeek === 0 ? Math.max(currentWeeks, 1) : currentWeeks + 1;
    }
    if (diffDays <= 14) return currentWeeks + 1;
    return 1;
  };

  const pushNotification = useCallback((n: Omit<Notification, "id" | "date" | "read">) => {
    setState((s) => ({
      ...s,
      notifications: [
        {
          id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          date: new Date().toISOString(),
          read: false,
          ...n,
        },
        ...s.notifications,
      ].slice(0, 30),
    }));
  }, []);

  const checkIn = useCallback((pubId: string, opts?: { ddMode?: boolean }) => {
    const ddMode = opts?.ddMode ?? false;
    const nowISO = new Date().toISOString();
    let result = { points: 0, alreadyToday: false };
    setState((s) => {
      const todayKey = nowISO.slice(0, 10);
      const already = s.checkIns.some((c) => c.pubId === pubId && c.date.slice(0, 10) === todayKey);
      if (already) {
        result = { points: 0, alreadyToday: true };
        return s;
      }
      const points = ddMode ? 50 : 100;
      result = { points, alreadyToday: false };
      const pubsVisited = s.pubsVisited.includes(pubId) ? s.pubsVisited : [...s.pubsVisited, pubId];
      const newStreak = computeStreakWeeks(s.streakWeeks, s.streakLastVisitISO, nowISO);
      return {
        ...s,
        points: s.points + points,
        pubsVisited,
        streakWeeks: newStreak,
        streakLastVisitISO: nowISO,
        checkIns: [
          {
            id: `ci-${Date.now()}`,
            pubId,
            date: nowISO,
            ddMode,
            pointsEarned: points,
          },
          ...s.checkIns,
        ],
      };
    });
    return result;
  }, []);

  const logPassportEntry: StateAPI["logPassportEntry"] = useCallback((e) => {
    const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setState((s) => {
      const entry: PassportEntry = {
        id,
        date: e.date ?? new Date().toISOString(),
        pubId: e.pubId,
        beer: e.beer,
        pintRating: e.pintRating,
        serviceRating: e.serviceRating,
        note: e.note,
        ddMode: e.ddMode,
      };
      const beers = s.beersTried.includes(e.beer) ? s.beersTried : [...s.beersTried, e.beer];
      const pubsVisited = s.pubsVisited.includes(e.pubId) ? s.pubsVisited : [...s.pubsVisited, e.pubId];
      return {
        ...s,
        passport: [entry, ...s.passport],
        pintsLogged: e.ddMode ? s.pintsLogged : s.pintsLogged + 1,
        beersTried: beers,
        pubsVisited,
        points: s.points + 50,
      };
    });
    return id;
  }, []);

  const markCardRead = useCallback((cardId: string) => {
    setState((s) => {
      if (s.cardsRead.includes(cardId)) return s;
      return {
        ...s,
        cardsRead: [...s.cardsRead, cardId],
        points: s.points + 25,
      };
    });
  }, []);

  const setQuizScore = useCallback((quizId: string, correct: number, total: number) => {
    let pointsEarned = 0;
    setState((s) => {
      const prev = s.quizScores[quizId] ?? 0;
      pointsEarned = Math.max(0, correct * 30 - prev);
      return {
        ...s,
        quizScores: { ...s.quizScores, [quizId]: Math.max(prev, correct) },
        points: s.points + pointsEarned,
      };
    });
    return pointsEarned;
  }, []);

  const setFlavourPrefs = useCallback((prefs: UserState["flavourPrefs"]) => {
    setState((s) => ({ ...s, flavourPrefs: prefs }));
  }, []);

  const redeemReward = useCallback((rewardId: string, fromVoucherId?: string) => {
    const reward = rewardById(rewardId);
    if (!reward) return null;
    let issued: ActiveVoucher | null = null;
    setState((s) => {
      if (reward.cost && !fromVoucherId) {
        if (s.points < reward.cost) return s;
      }
      const code = `TT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const now = new Date();
      const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24hr
      issued = {
        id: `v-${Date.now()}`,
        rewardId,
        code,
        issuedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        redeemed: false,
        pubScope: reward.pubScope,
      };
      const removeOldVoucher = fromVoucherId ? s.vouchers.filter((v) => v.id !== fromVoucherId) : s.vouchers;
      return {
        ...s,
        points: reward.cost && !fromVoucherId ? s.points - reward.cost : s.points,
        vouchers: [issued, ...removeOldVoucher],
      };
    });
    return issued;
  }, []);

  const voucherRedeem = useCallback((voucherId: string) => {
    let ok = false;
    setState((s) => {
      const v = s.vouchers.find((x) => x.id === voucherId);
      if (!v || v.redeemed) return s;
      ok = true;
      return {
        ...s,
        vouchers: s.vouchers.map((x) =>
          x.id === voucherId ? { ...x, redeemed: true, redeemedAt: new Date().toISOString() } : x,
        ),
      };
    });
    return ok;
  }, []);

  const shareReward = useCallback((rewardId: string, toName: string, message: string) => {
    const reward = rewardById(rewardId);
    if (!reward || !reward.shareable) return null;
    let result: SharedReward | null = null;
    setState((s) => {
      if (reward.cost && s.points < reward.cost) return s;
      const sr: SharedReward = {
        id: `sr-${Date.now()}`,
        rewardId,
        toName,
        message,
        sentAt: new Date().toISOString(),
        accepted: false,
        redeemed: false,
      };
      result = sr;
      return {
        ...s,
        points: reward.cost ? s.points - reward.cost : s.points,
        sharedRewards: [sr, ...s.sharedRewards],
      };
    });
    return result;
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const earnedBadges = useCallback(() => {
    return BADGES.filter((b) => b.predicate(state)).map((b) => b.id);
  }, [state]);

  const newlyEarnedBadges = useCallback(() => {
    const earned = BADGES.filter((b) => b.predicate(state)).map((b) => b.id);
    return earned.filter((id) => !state.badgesEarned.includes(id));
  }, [state]);

  useEffect(() => {
    if (!hydrated) return;
    const earned = BADGES.filter((b) => b.predicate(state)).map((b) => b.id);
    const newOnes = earned.filter((id) => !state.badgesEarned.includes(id));
    if (newOnes.length > 0) {
      setState((s) => ({ ...s, badgesEarned: earned }));
    }
  }, [state, hydrated]);

  const walletAdd = useCallback((voucherId: string) => {
    setState((s) => ({
      ...s,
      walletPasses: s.walletPasses.includes(voucherId) ? s.walletPasses : [...s.walletPasses, voucherId],
    }));
  }, []);

  const api: StateAPI = useMemo(
    () => ({
      state,
      setState,
      hydrated,
      reset,
      completeOnboarding,
      toggleDDMode,
      checkIn,
      logPassportEntry,
      markCardRead,
      setQuizScore,
      setFlavourPrefs,
      redeemReward,
      voucherRedeem,
      shareReward,
      markNotificationRead,
      pushNotification,
      earnedBadges,
      newlyEarnedBadges,
      walletAdd,
    }),
    [
      state,
      hydrated,
      reset,
      completeOnboarding,
      toggleDDMode,
      checkIn,
      logPassportEntry,
      markCardRead,
      setQuizScore,
      setFlavourPrefs,
      redeemReward,
      voucherRedeem,
      shareReward,
      markNotificationRead,
      pushNotification,
      earnedBadges,
      newlyEarnedBadges,
      walletAdd,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside StateProvider");
  return ctx;
}

/* Helpers */
export function recommendBeerForFlavour(prefs: string[]): BeerSlug {
  const score: Record<string, number> = {};
  for (const tag of prefs) {
    for (const b of [
      { slug: "landlord", flavours: ["bitter", "biscuit", "hoppy", "classic"] },
      { slug: "boltmaker", flavours: ["smooth", "biscuit", "fruity", "classic"] },
      { slug: "golden-best", flavours: ["light", "honeyed", "smooth", "classic"] },
      { slug: "knowle-spring", flavours: ["light", "fruity", "hoppy", "modern"] },
      { slug: "landlord-dark", flavours: ["dark", "smooth", "biscuit", "classic"] },
      { slug: "dark-mild", flavours: ["dark", "smooth", "roasted", "classic"] },
      { slug: "hopical-storm", flavours: ["hoppy", "fruity", "modern", "bitter"] },
    ]) {
      if (b.flavours.includes(tag)) score[b.slug] = (score[b.slug] || 0) + 1;
    }
  }
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  return (sorted[0]?.[0] as BeerSlug) || "landlord";
}

export function favouriteBeer(state: UserState): BeerSlug | null {
  const counts: Record<string, number> = {};
  for (const e of state.passport) counts[e.beer] = (counts[e.beer] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (sorted[0]?.[0] as BeerSlug) || null;
}

export function favouritePub(state: UserState): string | null {
  const counts: Record<string, number> = {};
  for (const e of state.passport) counts[e.pubId] = (counts[e.pubId] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
}

export function beerName(slug: BeerSlug) {
  return beerBySlug(slug)?.name ?? slug;
}
