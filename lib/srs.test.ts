import { test } from "node:test";
import assert from "node:assert/strict";
import { DAG, INTERVALLEN, nieuweKaart, teHerhalen, verwerkAntwoord } from "./srs.ts";

test("nieuwe kaart komt na een dag terug", () => {
  const k = nieuweKaart("w1", "lezen", 0);
  assert.equal(k.volgende, DAG);
  assert.equal(k.bak, 0);
});

test("goed antwoord schuift een bak op, fout zet terug", () => {
  let k = nieuweKaart("w1", "lezen", 0);
  k = verwerkAntwoord(k, true, DAG);
  assert.equal(k.bak, 1);
  assert.equal(k.volgende, DAG + INTERVALLEN[1] * DAG);
  assert.equal(k.herhalingen[0].sindsVorige, DAG);
  k = verwerkAntwoord(k, false, 5 * DAG);
  assert.equal(k.bak, 0);
  assert.equal(k.herhalingen[1].sindsVorige, 4 * DAG);
});

test("bak loopt niet voorbij de laatste", () => {
  let k = nieuweKaart("w1", "lezen", 0);
  for (let i = 0; i < 20; i++) k = verwerkAntwoord(k, true, i * DAG);
  assert.equal(k.bak, INTERVALLEN.length - 1);
});

test("teHerhalen geeft alleen kaarten die aan de beurt zijn", () => {
  const a = nieuweKaart("a", "lezen", 0);
  const b = nieuweKaart("b", "beeld", 2 * DAG);
  assert.deepEqual(teHerhalen([a, b], 1.5 * DAG).map((k) => k.woordId), ["a"]);
});
