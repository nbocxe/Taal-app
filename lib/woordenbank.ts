// De ingebouwde woordenlijst. Elk vakgebied staat in een eigen bestand in lib/woorden/.
// Nieuwe woorden toevoegen? Kopieer daar een bestaand blok en pas het aan.
// De foute antwoorden in de overhoring zijn betekenissen van andere woorden, dus die hoef je niet te bedenken.
// Een nieuw vakgebied? Maak een nieuw bestand in lib/woorden/ en voeg het hieronder toe.

import type { Niveau, Woord } from "./types.ts";
import { algemeneKennis } from "./woorden/algemene-kennis.ts";
import { biologie } from "./woorden/biologie.ts";
import { economie } from "./woorden/economie.ts";
import { filosofie } from "./woorden/filosofie.ts";
import { maatschappij } from "./woorden/maatschappij.ts";
import { natuurkunde } from "./woorden/natuurkunde.ts";
import { politiek } from "./woorden/politiek.ts";
import { politiekeStromingen } from "./woorden/politieke-stromingen.ts";
import { psychologie } from "./woorden/psychologie.ts";
import { recht } from "./woorden/recht.ts";
import { taalEnRetorica } from "./woorden/taal-en-retorica.ts";
import { tech } from "./woorden/tech.ts";

export type BankWoord = Omit<Woord, "id" | "domein">;

export const WOORDENBANK: Record<string, BankWoord[]> = {
  "Algemene kennis": algemeneKennis,
  "Taal & retorica": taalEnRetorica,
  Filosofie: filosofie,
  Politiek: politiek,
  "Politieke stromingen": politiekeStromingen,
  Maatschappij: maatschappij,
  Economie: economie,
  Recht: recht,
  Psychologie: psychologie,
  Biologie: biologie,
  Natuurkunde: natuurkunde,
  Tech: tech,
};

export const DOMEINEN = Object.keys(WOORDENBANK);

/** Een vast id per woord, zodat de app weet welke woorden je al kent. */
export function woordId(domein: string, woord: string): string {
  return `${domein}:${woord}`.toLowerCase();
}

const NIVEAU_VOLGORDE: Niveau[] = ["basis", "gevorderd", "expert"];

/**
 * Kies nieuwe woorden uit een vakgebied die je nog niet geleerd hebt.
 * Woorden op je eigen niveau gaan voor; zijn die op, dan volgen de dichtstbijzijnde niveaus.
 */
export function kiesNieuweWoorden(
  domein: string,
  niveau: Niveau,
  bekend: Set<string>,
  aantal: number,
  kans: () => number = Math.random,
): Woord[] {
  const eigen = NIVEAU_VOLGORDE.indexOf(niveau);
  const afstand = (w: BankWoord) => Math.abs(NIVEAU_VOLGORDE.indexOf(w.niveau) - eigen);

  return (WOORDENBANK[domein] ?? [])
    .map((w) => ({ ...w, id: woordId(domein, w.woord), domein, _toeval: kans() }))
    .filter((w) => !bekend.has(w.id))
    .sort((a, b) => afstand(a) - afstand(b) || a._toeval - b._toeval)
    .slice(0, aantal)
    .map(({ _toeval, ...w }) => w);
}

/** Hoeveel woorden er in een vakgebied nog over zijn. */
export function aantalOver(domein: string, bekend: Set<string>): number {
  return (WOORDENBANK[domein] ?? []).filter((w) => !bekend.has(woordId(domein, w.woord))).length;
}

/**
 * Kies foute antwoorden voor de overhoring: betekenissen van andere woorden, bij voorkeur uit hetzelfde vakgebied.
 * We nemen de betekenissen die qua lengte het dichtst bij de echte liggen, zodat je het goede antwoord
 * niet kunt raden door simpelweg het langste (of kortste) te kiezen.
 */
export function kiesAfleiders(
  woord: Pick<Woord, "domein" | "woord" | "definitie">,
  aantal = 3,
  kans: () => number = Math.random,
): string[] {
  const doel = woord.woord.toLowerCase();
  const bruikbaar = (w: BankWoord) =>
    w.woord.toLowerCase() !== doel &&
    w.definitie !== woord.definitie &&
    // Een betekenis waarin het gevraagde woord zelf voorkomt, zou je op het verkeerde been zetten.
    !w.definitie.toLowerCase().includes(doel);

  let kandidaten = (WOORDENBANK[woord.domein] ?? []).filter(bruikbaar);
  if (kandidaten.length < aantal * 2) {
    const overig = Object.entries(WOORDENBANK)
      .filter(([domein]) => domein !== woord.domein)
      .flatMap(([, woorden]) => woorden.filter(bruikbaar));
    kandidaten = [...kandidaten, ...overig];
  }

  const lengte = woord.definitie.length;
  const dichtstbij = [...new Set(kandidaten.map((w) => w.definitie))]
    .sort((a, b) => Math.abs(a.length - lengte) - Math.abs(b.length - lengte))
    .slice(0, aantal * 2);

  // Uit de dichtstbijzijnde kandidaten kiezen we willekeurig, zodat het niet elke keer dezelfde zijn.
  return dichtstbij
    .map((definitie) => ({ definitie, r: kans() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, aantal)
    .map((x) => x.definitie);
}
