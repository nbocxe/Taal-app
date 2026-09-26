import { test } from "node:test";
import assert from "node:assert/strict";
import { controleer, verschil } from "./spelling.ts";

test("precies goed, ook met spaties aan de randen", () => {
  assert.equal(controleer("  paradigma ", "paradigma"), "goed");
  assert.equal(controleer("ne  bis in idem", "ne bis in idem"), "goed");
});

test("alleen een verschil in hoofdletters wordt apart gemeld", () => {
  assert.equal(controleer("crispr", "CRISPR"), "hoofdletters");
  assert.equal(controleer("Paradigma", "paradigma"), "hoofdletters");
});

test("accenten, streepjes en letters moeten kloppen", () => {
  assert.equal(controleer("stoicisme", "stoïcisme"), "fout");
  assert.equal(controleer("placebo effect", "placebo-effect"), "fout");
  assert.equal(controleer("paradigmma", "paradigma"), "fout");
  assert.equal(controleer("", "paradigma"), "fout");
});

test("verschil markeert welke letters van het juiste woord ontbraken of anders waren", () => {
  const stukjes = verschil("paradima", "paradigma");
  assert.equal(stukjes.map((s) => s.tekst).join(""), "paradigma");
  assert.deepEqual(
    stukjes.filter((s) => s.anders).map((s) => s.tekst),
    ["g"],
  );
});

test("verschil bij een goed woord markeert niets", () => {
  assert.ok(verschil("enquête", "enquête").every((s) => !s.anders));
});

test("verschil bij een leeg antwoord markeert alles", () => {
  assert.deepEqual(verschil("", "ethos"), [{ tekst: "ethos", anders: true }]);
});
