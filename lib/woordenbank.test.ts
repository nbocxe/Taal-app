import { test } from "node:test";
import assert from "node:assert/strict";
import { aantalOver, kiesNieuweWoorden, woordId, WOORDENBANK } from "./woordenbank.ts";

test("elk woord in de bank is compleet en uniek", () => {
  const ids = new Set<string>();
  for (const [domein, woorden] of Object.entries(WOORDENBANK)) {
    for (const w of woorden) {
      const id = woordId(domein, w.woord);
      assert.ok(!ids.has(id), `dubbel woord: ${id}`);
      ids.add(id);
      for (const veld of ["woord", "woordsoort", "definitie", "voorbeeldzin", "herkomst", "beeld", "emoji"] as const) {
        assert.ok(w[veld].trim().length > 0, `${id}: ${veld} is leeg`);
      }
      assert.equal(w.afleiders.length, 3, `${id}: precies drie afleiders nodig`);
      const opties = new Set([w.definitie, ...w.afleiders]);
      assert.equal(opties.size, 4, `${id}: afleiders moeten verschillen van elkaar en van de definitie`);
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
