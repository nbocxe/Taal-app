"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DOMEINEN } from "@/lib/domeinen";
import { METHODES, METHODE_IDS } from "@/lib/methodes";
import { useAppData } from "@/lib/opslag";
import type { MethodeId, Niveau } from "@/lib/types";

export default function Start() {
  const router = useRouter();
  const [data, wijzig] = useAppData();
  const [domeinen, setDomeinen] = useState<string[]>([]);
  const [eigen, setEigen] = useState("");
  const [niveau, setNiveau] = useState<Niveau>("gevorderd");
  const [voorkeur, setVoorkeur] = useState<MethodeId | "weet-niet">("weet-niet");

  // Bij het aanpassen van je voorkeuren beginnen we met wat je eerder koos.
  const profiel = data?.profiel;
  useEffect(() => {
    if (!profiel) return;
    setDomeinen(profiel.domeinen.filter((d) => DOMEINEN.includes(d)));
    setEigen(profiel.domeinen.find((d) => !DOMEINEN.includes(d)) ?? "");
    setNiveau(profiel.niveau);
    setVoorkeur(profiel.voorkeur);
  }, [profiel]);

  if (!data) return null;

  const wissel = (d: string) =>
    setDomeinen((huidig) => (huidig.includes(d) ? huidig.filter((x) => x !== d) : [...huidig, d]));

  const alleDomeinen = [...domeinen, ...(eigen.trim() ? [eigen.trim()] : [])];

  const opslaan = () => {
    wijzig((d) => ({ ...d, profiel: { domeinen: alleDomeinen, niveau, voorkeur } }));
    router.push("/leren");
  };

  return (
    <>
      <h1>Even kennismaken</h1>

      <div className="kaart">
        <h2>1. Welke vakgebieden interesseren je?</h2>
        <div className="rij">
          {DOMEINEN.map((d) => (
            <button
              key={d}
              className={domeinen.includes(d) ? "" : "tweede"}
              onClick={() => wissel(d)}
              aria-pressed={domeinen.includes(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <label>
          <span className="zacht">Of een eigen onderwerp, bijvoorbeeld "sterrenkunde" of "wijn":</span>
          <input type="text" value={eigen} onChange={(e) => setEigen(e.target.value)} maxLength={80} />
        </label>
      </div>

      <div className="kaart">
        <h2>2. Welk niveau?</h2>
        <select value={niveau} onChange={(e) => setNiveau(e.target.value as Niveau)}>
          <option value="basis">Basis: woorden uit de krant en populaire artikelen</option>
          <option value="gevorderd">Gevorderd: kwaliteitskrant en inleidende studieboeken</option>
          <option value="expert">Expert: vaktermen voor professionals</option>
        </select>
      </div>

      <div className="kaart">
        <h2>3. Hoe denk je zelf dat je het beste leert?</h2>
        <p className="zacht">
          Dit verandert niets aan de app. We vergelijken het later met wat je echt onthoudt. Dat is vaak
          verrassend!
        </p>
        {METHODE_IDS.map((m) => (
          <button
            key={m}
            className={`keuze ${voorkeur === m ? "gekozen" : ""}`}
            onClick={() => setVoorkeur(m)}
          >
            <strong>{METHODES[m].naam}</strong>: {METHODES[m].korteUitleg}
          </button>
        ))}
        <button
          className={`keuze ${voorkeur === "weet-niet" ? "gekozen" : ""}`}
          onClick={() => setVoorkeur("weet-niet")}
        >
          Ik weet het echt niet
        </button>
      </div>

      <button onClick={opslaan} disabled={alleDomeinen.length === 0}>
        Beginnen
      </button>
    </>
  );
}
