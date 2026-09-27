import { test } from "node:test";
import assert from "node:assert/strict";
import { hoofdstukWoorden, kiesPadWoorden, leesAlineas, PADEN, padVoortgang, vindPad } from "./leerpaden.ts";
import { WOORDENBANK } from "./woordenbank.ts";

test("elk woord in een leerpad bestaat in de woordenbank van het vakgebied", () => {
  for (const pad of PADEN) {
    const bank = new Set((WOORDENBANK[pad.domein] ?? []).map((w) => w.woord));
    assert.ok(bank.size > 0, `${pad.id}: onbekend vakgebied ${pad.domein}`);
    for (const h of pad.hoofdstukken) {
      for (const naam of h.woorden) assert.ok(bank.has(naam), `${pad.id}: "${naam}" staat niet in ${pad.domein}`);
    }
  }
});

test("geen woord staat twee keer in hetzelfde pad en ids zijn uniek", () => {
  assert.equal(new Set(PADEN.map((p) => p.id)).size, PADEN.length);
  for (const pad of PADEN) {
    const alle = pad.hoofdstukken.flatMap((h) => h.woorden);
    assert.equal(new Set(alle).size, alle.length, `${pad.id}: dubbel woord`);
  }
});

test("elk woord van een hoofdstuk is gemarkeerd in de leestekst, en alleen die woorden", () => {
  for (const pad of PADEN) {
    for (const h of pad.hoofdstukken) {
      const gemarkeerd = new Set(leesAlineas(h.leestekst).flat().flatMap((d) => (d.woord ? [d.woord] : [])));
      for (const naam of h.woorden) assert.ok(gemarkeerd.has(naam), `${pad.id} / ${h.titel}: "${naam}" niet gemarkeerd`);
      for (const naam of gemarkeerd) assert.ok(h.woorden.includes(naam), `${pad.id} / ${h.titel}: "${naam}" hoort niet bij dit hoofdstuk`);
    }
  }
});

test("de leestekst wordt netjes in alinea's en markeringen gesplitst", () => {
  const alineas = leesAlineas("Een [[zwart gat]] en twee [[zwarte gaten|zwart gat]].\n\nTweede alinea.");
  assert.equal(alineas.length, 2);
  assert.deepEqual(alineas[0], [
    { tekst: "Een " },
    { tekst: "zwart gat", woord: "zwart gat" },
    { tekst: " en twee " },
    { tekst: "zwarte gaten", woord: "zwart gat" },
    { tekst: "." },
  ]);
  assert.deepEqual(alineas[1], [{ tekst: "Tweede alinea." }]);
});

test("een pad-ronde volgt de volgorde van het hoofdstuk en slaat bekende woorden over", () => {
  const pad = vindPad("hawking")!;
  const alle = hoofdstukWoorden(pad, pad.hoofdstukken[0]);
  assert.deepEqual(alle.map((w) => w.woord), pad.hoofdstukken[0].woorden);
  assert.ok(alle.every((w) => w.domein === "Natuurkunde"));

  const bekend = new Set([alle[0].id, alle[2].id]);
  const ronde = kiesPadWoorden(pad, 0, bekend);
  assert.deepEqual(ronde.map((w) => w.id), alle.filter((w) => !bekend.has(w.id)).map((w) => w.id));
  assert.deepEqual(kiesPadWoorden(pad, 99, bekend), []);

  assert.deepEqual(padVoortgang(pad, bekend, 0), { geleerd: 2, totaal: alle.length });
  const totaal = pad.hoofdstukken.reduce((som, h) => som + h.woorden.length, 0);
  assert.deepEqual(padVoortgang(pad, bekend), { geleerd: 2, totaal });
});
