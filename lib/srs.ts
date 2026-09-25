// Spaced repetition met een eenvoudig Leitner-systeem: elke keer dat je een woord
// goed hebt, schuift het een bak op en zie je het pas later terug.

import type { Kaart, MethodeId } from "./types.ts";

export const DAG = 24 * 60 * 60 * 1000;

/** Wachttijd in dagen per bak. */
export const INTERVALLEN = [1, 3, 7, 16, 35, 90];

export function nieuweKaart(woordId: string, methode: MethodeId, nu: number): Kaart {
  return {
    woordId,
    methode,
    geleerdOp: nu,
    bak: 0,
    volgende: nu + INTERVALLEN[0] * DAG,
    herhalingen: [],
  };
}

export function laatsteContact(kaart: Kaart): number {
  const laatste = kaart.herhalingen[kaart.herhalingen.length - 1];
  return laatste ? laatste.op : kaart.geleerdOp;
}

export function verwerkAntwoord(kaart: Kaart, goed: boolean, nu: number): Kaart {
  const bak = goed ? Math.min(kaart.bak + 1, INTERVALLEN.length - 1) : 0;
  return {
    ...kaart,
    bak,
    volgende: nu + INTERVALLEN[bak] * DAG,
    herhalingen: [
      ...kaart.herhalingen,
      { op: nu, goed, sindsVorige: nu - laatsteContact(kaart) },
    ],
  };
}

export function teHerhalen(kaarten: Kaart[], nu: number): Kaart[] {
  return kaarten.filter((k) => k.volgende <= nu).sort((a, b) => a.volgende - b.volgende);
}
