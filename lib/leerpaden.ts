// Leerpaden: woorden leren in de context van een bron, zoals een boek.
// De inhoud van elk pad staat in lib/paden/. Een nieuw pad? Maak daar een bestand en voeg het hieronder toe.

import { dsm5 } from "./paden/dsm5.ts";
import { hawking } from "./paden/hawking.ts";
import type { Hoofdstuk, LeerPad, Woord } from "./types.ts";
import { woordId, WOORDENBANK } from "./woordenbank.ts";

export const PADEN: LeerPad[] = [hawking, dsm5];

export function vindPad(id: string | null | undefined): LeerPad | undefined {
  return PADEN.find((p) => p.id === id);
}

/** De woorden van een hoofdstuk als volledige woorden uit de woordenbank, in de volgorde van het hoofdstuk. */
export function hoofdstukWoorden(pad: LeerPad, hoofdstuk: Hoofdstuk): Woord[] {
  const bank = WOORDENBANK[pad.domein] ?? [];
  return hoofdstuk.woorden.flatMap((naam) => {
    const w = bank.find((b) => b.woord === naam);
    return w ? [{ ...w, id: woordId(pad.domein, w.woord), domein: pad.domein }] : [];
  });
}

/** De woorden van een hoofdstuk die je nog niet kent, in de volgorde van het hoofdstuk. */
export function kiesPadWoorden(pad: LeerPad, index: number, bekend: Set<string>): Woord[] {
  const hoofdstuk = pad.hoofdstukken[index];
  return hoofdstuk ? hoofdstukWoorden(pad, hoofdstuk).filter((w) => !bekend.has(w.id)) : [];
}

/** Hoeveel woorden van (een hoofdstuk van) het pad je al kent. */
export function padVoortgang(pad: LeerPad, bekend: Set<string>, index?: number) {
  const hoofdstukken = index === undefined ? pad.hoofdstukken : [pad.hoofdstukken[index]];
  const woorden = hoofdstukken.flatMap((h) => hoofdstukWoorden(pad, h));
  return { geleerd: woorden.filter((w) => bekend.has(w.id)).length, totaal: woorden.length };
}

/** Een stukje leestekst: gewone tekst, of een gemarkeerd woord met een verwijzing naar de woordenbank. */
export type Tekstdeel = { tekst: string; woord?: string };

/** Splitst een leestekst in alinea's, en elke alinea in gewone tekst en gemarkeerde woorden. */
export function leesAlineas(leestekst: string): Tekstdeel[][] {
  return leestekst
    .split(/\n\s*\n/)
    .map((alinea) =>
      alinea
        .trim()
        .split(/(\[\[[^\]]+\]\])/)
        .filter((stuk) => stuk !== "")
        .map((stuk) => {
          const markering = stuk.match(/^\[\[([^|\]]+)(?:\|([^\]]+))?\]\]$/);
          return markering ? { tekst: markering[1], woord: markering[2] ?? markering[1] } : { tekst: stuk };
        }),
    );
}
