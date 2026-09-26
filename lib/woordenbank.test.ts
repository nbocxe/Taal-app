import { test } from "node:test";
import assert from "node:assert/strict";
import { aantalOver, kiesAfleiders, kiesNieuweWoorden, woordId, WOORDENBANK } from "./woordenbank.ts";

test("elk woord in de bank is compleet en uniek", () => {
  const ids = new Set<string>();
  for (const [domein, woorden] of Object.entries(WOORDENBANK)) {
    for (const w of woorden) {
      const id = woordId(domein, w.woord);
      assert.ok(!ids.has(id), `dubbel woord: ${id}`);
      ids.add(id);
      for (const veld of ["woord", "woordsoort", "definitie", "voorbeeldzin", "herkomst", "beeld"] as const) {
        assert.ok(w[veld].trim().length > 0, `${id}: ${veld} is leeg`);
      }
      assert.ok(
        !w.definitie.toLowerCase().includes(w.woord.toLowerCase()),
        `${id}: de definitie verklapt het woord zelf`,
      );
      // Elke voorbeeldzin moet het woord (of een vervoeging ervan) echt gebruiken.
      const stam = w.woord.toLowerCase().slice(0, 5);
      assert.ok(w.voorbeelden.length >= 2, `${id}: minstens twee extra voorbeelden nodig`);
      for (const zin of [w.voorbeeldzin, ...w.voorbeelden]) {
        assert.ok(zin.toLowerCase().includes(stam), `${id}: voorbeeld zonder het woord: "${zin}"`);
      }
      assert.equal(new Set([w.voorbeeldzin, ...w.voorbeelden]).size, w.voorbeelden.length + 1, `${id}: dubbel voorbeeld`);
    }
  }
});

test("elk woord krijgt drie verschillende foute antwoorden uit hetzelfde vakgebied", () => {
  for (const [domein, woorden] of Object.entries(WOORDENBANK)) {
    const betekenissen = new Set(woorden.map((w) => w.definitie));
    for (const w of woorden) {
      const afleiders = kiesAfleiders({ ...w, domein });
      assert.equal(new Set(afleiders).size, 3, `${w.woord}: drie verschillende afleiders nodig`);
      assert.ok(!afleiders.includes(w.definitie), `${w.woord}: afleider gelijk aan het goede antwoord`);
      assert.ok(afleiders.every((a) => betekenissen.has(a)), `${w.woord}: afleider uit ander vakgebied`);
    }
  }
});

test("het goede antwoord valt niet op door zijn lengte", () => {
  // Als het goede antwoord vaak het langste is, kun je raden zonder het woord te kennen.
  // Bij eerlijke opties is het goede antwoord ongeveer 1 op de 4 keer het langste.
  let langste = 0;
  let totaal = 0;
  for (const [domein, woorden] of Object.entries(WOORDENBANK)) {
    for (const w of woorden) {
      const afleiders = kiesAfleiders({ ...w, domein });
      if (w.definitie.length > Math.max(...afleiders.map((a) => a.length))) langste++;
      totaal++;
    }
  }
  assert.ok(langste / totaal < 0.4, `goede antwoord is in ${Math.round((100 * langste) / totaal)}% het langste`);
});

test("de woorden die de gebruiker zelf aandroeg staan erin", () => {
  // Deze woorden zijn ooit per ongeluk verdwenen; deze test voorkomt dat dat nog eens ongemerkt gebeurt.
  const alle = new Set(Object.values(WOORDENBANK).flat().map((w) => w.woord.toLowerCase()));
  const gevraagd = [
    "adequatie", "paradigma", "determinisme", "hedonisme", "anonimiteit", "anomie", "normeren", "legitimeren",
    "affiliatie", "pedant", "logos", "ethos", "pathos", "liberalisme", "conservatisme", "fascisme", "communisme",
  ];
  for (const woord of gevraagd) assert.ok(alle.has(woord), `"${woord}" ontbreekt`);
});

test("geen woord staat in twee vakgebieden en elk vakgebied heeft alle niveaus", () => {
  const gezien = new Map<string, string>();
  for (const [domein, woorden] of Object.entries(WOORDENBANK)) {
    for (const w of woorden) {
      const sleutel = w.woord.toLowerCase();
      assert.ok(!gezien.has(sleutel), `"${w.woord}" staat in ${gezien.get(sleutel)} én ${domein}`);
      gezien.set(sleutel, domein);
    }
    for (const niveau of ["basis", "gevorderd", "expert"]) {
      assert.ok(woorden.some((w) => w.niveau === niveau), `${domein} heeft geen woorden op niveau ${niveau}`);
    }
  }
});

test("kiest eerst woorden op je eigen niveau", () => {
  const gekozen = kiesNieuweWoorden("Politiek", "expert", new Set(), 5);
  assert.equal(gekozen.length, 5);
  assert.ok(gekozen.every((w) => w.niveau === "expert"));
  assert.ok(gekozen.every((w) => w.domein === "Politiek"));
});

test("slaat bekende woorden over en vult aan met het dichtstbijzijnde niveau", () => {
  const expert = kiesNieuweWoorden("Politiek", "expert", new Set(), 100).filter((w) => w.niveau === "expert");
  const bekend = new Set(expert.map((w) => w.id));
  const gekozen = kiesNieuweWoorden("Politiek", "expert", bekend, 5);
  assert.ok(gekozen.every((w) => !bekend.has(w.id)));
  assert.ok(gekozen.every((w) => w.niveau === "gevorderd"));
});

test("aantalOver telt wat er nog te leren is", () => {
  const totaal = WOORDENBANK["Tech"].length;
  const een = kiesNieuweWoorden("Tech", "basis", new Set(), 1);
  assert.equal(aantalOver("Tech", new Set()), totaal);
  assert.equal(aantalOver("Tech", new Set(een.map((w) => w.id))), totaal - 1);
});
