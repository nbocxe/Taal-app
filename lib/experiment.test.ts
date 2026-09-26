import { test } from "node:test";
import assert from "node:assert/strict";
import { analyseer, eersteMeting, kiesMethodes, MIN_METINGEN } from "./experiment.ts";
import { METHODE_IDS } from "./methodes.ts";
import { DAG, nieuweKaart, verwerkAntwoord } from "./srs.ts";
import type { Kaart, MethodeId } from "./types.ts";

// Eenvoudige voorspelbare kansgenerator, zodat de tests steeds hetzelfde doen.
function zaad(s: number) {
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

function gemetenKaart(methode: MethodeId, goed: boolean, i: number): Kaart {
  return verwerkAntwoord(nieuweKaart(`${methode}-${i}`, methode, 0), goed, DAG);
}

test("verkennen verdeelt eerlijk over alle methodes", () => {
  const gekozen = kiesMethodes([], 8, zaad(1));
  for (const m of METHODE_IDS) assert.equal(gekozen.filter((g) => g === m).length, 2);
});

test("een herhaling binnen een paar uur telt niet als meting", () => {
  const k = verwerkAntwoord(nieuweKaart("x", "lezen", 0), true, 60 * 60 * 1000);
  assert.equal(eersteMeting(k), null);
});

test("na genoeg metingen krijgt de beste methode vaker de beurt", () => {
  const kaarten: Kaart[] = [];
  for (const m of METHODE_IDS) {
    for (let i = 0; i < 20; i++) {
      // 'doen' gaat bijna altijd goed, de rest de helft van de tijd.
      const goed = m === "doen" ? i < 19 : i % 2 === 0;
      kaarten.push(gemetenKaart(m, goed, i));
    }
  }
  const analyse = analyseer(kaarten, zaad(2));
  assert.equal(analyse.fase, "benutten");
  assert.equal(analyse.beste, "doen");

  const gekozen = kiesMethodes(kaarten, 100, zaad(3));
  const doen = gekozen.filter((g) => g === "doen").length;
  assert.ok(doen > 60, `doen kreeg ${doen} van de 100 beurten`);
  assert.ok(doen < 100, "andere methodes blijven af en toe terugkomen");
});

test("met te weinig metingen noemen we nog geen beste methode", () => {
  const kaarten = METHODE_IDS.flatMap((m) =>
    Array.from({ length: MIN_METINGEN - 1 }, (_, i) => gemetenKaart(m, true, i)),
  );
  const analyse = analyseer(kaarten, zaad(4));
  assert.equal(analyse.fase, "verkennen");
  assert.equal(analyse.beste, null);
});
