// Het "persoonlijke experiment": nieuwe woorden krijgen elk een leermethode toegewezen.
// Bij de eerste herhaling (minstens ~een dag later) meten we of je het nog wist.
// Zo zie je op basis van je eigen resultaten welke methode voor jou het beste werkt.

import { METHODE_IDS } from "./methodes.ts";
import type { Kaart, MethodeId } from "./types.ts";

/** Aantal metingen per methode voordat we iets durven te zeggen. */
export const MIN_METINGEN = 8;

/** Een herhaling telt als meting als er minstens zoveel tijd sinds het leren zat. */
export const MIN_UITSTEL = 20 * 60 * 60 * 1000;

/** Ook als er een duidelijke winnaar is, krijgt dit deel van de woorden een willekeurige methode. */
export const VERKEN_KANS = 0.2;

export interface MethodeStat {
  methode: MethodeId;
  geleerd: number;
  gemeten: number;
  goed: number;
  /** Aandeel goed bij de eerste herhaling, of null zonder metingen. */
  score: number | null;
  /** Geschatte kans dat dit echt je beste methode is. */
  kansBeste: number;
}

export interface Analyse {
  fase: "verkennen" | "benutten";
  perMethode: MethodeStat[];
  /** Voortgang van de verkenningsfase, van 0 tot 1. */
  voortgang: number;
  beste: MethodeId | null;
}

type Kansfunctie = () => number;

/** De eerste herhaling na het leren is de eerlijkste meting: iedere methode krijgt dezelfde test na ongeveer dezelfde tijd. */
export function eersteMeting(kaart: Kaart): boolean | null {
  const eerste = kaart.herhalingen[0];
  if (!eerste || eerste.sindsVorige < MIN_UITSTEL) return null;
  return eerste.goed;
}

function telPerMethode(kaarten: Kaart[]) {
  const tellingen = Object.fromEntries(
    METHODE_IDS.map((m) => [m, { geleerd: 0, gemeten: 0, goed: 0 }]),
  ) as Record<MethodeId, { geleerd: number; gemeten: number; goed: number }>;
  for (const kaart of kaarten) {
    const t = tellingen[kaart.methode];
    t.geleerd++;
    const meting = eersteMeting(kaart);
    if (meting !== null) {
      t.gemeten++;
      if (meting) t.goed++;
    }
  }
  return tellingen;
}

// Beta(a, b) met gehele a en b, via twee gamma-trekkingen (som van exponentiëlen).
function trekBeta(a: number, b: number, kans: Kansfunctie): number {
  const gamma = (k: number) => {
    let som = 0;
    for (let i = 0; i < k; i++) som -= Math.log(1 - kans());
    return som;
  };
  const x = gamma(a);
  const y = gamma(b);
  return x / (x + y);
}

function trekPerMethode(
  tellingen: ReturnType<typeof telPerMethode>,
  kans: Kansfunctie,
  methodes: MethodeId[],
): MethodeId {
  let beste = methodes[0];
  let hoogste = -1;
  for (const m of methodes) {
    const { gemeten, goed } = tellingen[m];
    const trekking = trekBeta(1 + goed, 1 + gemeten - goed, kans);
    if (trekking > hoogste) {
      hoogste = trekking;
      beste = m;
    }
  }
  return beste;
}

/**
 * Kies een methode voor elk nieuw woord, alleen uit de methodes die je zelf hebt aangevinkt.
 * Eerst verdelen we eerlijk over die methodes (verkennen). Zodra er genoeg metingen zijn,
 * krijgt de methode die bij jou het best werkt vaker de beurt (Thompson sampling),
 * maar blijven de andere af en toe terugkomen (VERKEN_KANS), voor het geval je verandert.
 */
export function kiesMethodes(
  kaarten: Kaart[],
  aantal: number,
  kans: Kansfunctie = Math.random,
  toegestaan: MethodeId[] = METHODE_IDS,
): MethodeId[] {
  const methodes = toegestaan.length > 0 ? toegestaan : METHODE_IDS;
  const tellingen = telPerMethode(kaarten);
  const verkennen = methodes.some((m) => tellingen[m].gemeten < MIN_METINGEN);
  const gekozen: MethodeId[] = [];

  for (let i = 0; i < aantal; i++) {
    let methode: MethodeId;
    if (verkennen) {
      const minste = Math.min(...methodes.map((m) => tellingen[m].geleerd));
      const kandidaten = methodes.filter((m) => tellingen[m].geleerd === minste);
      methode = kandidaten[Math.floor(kans() * kandidaten.length)];
    } else if (kans() < VERKEN_KANS) {
      methode = methodes[Math.floor(kans() * methodes.length)];
    } else {
      methode = trekPerMethode(tellingen, kans, methodes);
    }
    tellingen[methode].geleerd++;
    gekozen.push(methode);
  }
  return gekozen;
}

/** Vergelijkt de aangevinkte methodes met elkaar. Met één methode valt er niets te vergelijken. */
export function analyseer(
  kaarten: Kaart[],
  kans: Kansfunctie = Math.random,
  toegestaan: MethodeId[] = METHODE_IDS,
): Analyse {
  const methodes = toegestaan.length > 0 ? toegestaan : METHODE_IDS;
  const tellingen = telPerMethode(kaarten);

  // Schat per methode de kans dat hij de beste is door veel keer te trekken.
  const RONDES = 2000;
  const gewonnen = Object.fromEntries(methodes.map((m) => [m, 0])) as Record<MethodeId, number>;
  for (let i = 0; i < RONDES; i++) gewonnen[trekPerMethode(tellingen, kans, methodes)]++;

  const perMethode: MethodeStat[] = methodes.map((m) => {
    const t = tellingen[m];
    return {
      methode: m,
      ...t,
      score: t.gemeten > 0 ? t.goed / t.gemeten : null,
      kansBeste: gewonnen[m] / RONDES,
    };
  });

  const minGemeten = Math.min(...perMethode.map((s) => s.gemeten));
  const fase = minGemeten >= MIN_METINGEN ? "benutten" : "verkennen";
  const koploper = [...perMethode].sort((a, b) => b.kansBeste - a.kansBeste)[0];

  return {
    fase,
    perMethode,
    voortgang: Math.min(1, minGemeten / MIN_METINGEN),
    beste: fase === "benutten" && methodes.length > 1 ? koploper.methode : null,
  };
}

