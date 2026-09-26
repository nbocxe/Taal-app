"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { METHODES, METHODE_IDS } from "@/lib/methodes";
import { useAppData } from "@/lib/opslag";
import type { MethodeId, Niveau } from "@/lib/types";
import { DOMEINEN } from "@/lib/woordenbank";
import { Illustratie } from "../components/Illustratie";

const NIVEAUS: { id: Niveau; naam: string; uitleg: string }[] = [
  { id: "basis", naam: "Basis", uitleg: "Woorden uit de krant en populaire artikelen" },
  { id: "gevorderd", naam: "Gevorderd", uitleg: "Kwaliteitskrant en inleidende studieboeken" },
  { id: "expert", naam: "Expert", uitleg: "Vaktermen voor professionals" },
];

export default function Start() {
  const router = useRouter();
  const [data, wijzig] = useAppData();
  const [domeinen, setDomeinen] = useState<string[]>([]);
  const [niveau, setNiveau] = useState<Niveau>("gevorderd");
  // Leeg betekent "ik weet het niet": dan wisselen alle methodes elkaar af.
  const [methodes, setMethodes] = useState<MethodeId[]>([]);

  // Bij het aanpassen van je voorkeuren beginnen we met wat je eerder koos.
  const profiel = data?.profiel;
  useEffect(() => {
    if (!profiel) return;
    setDomeinen(profiel.domeinen.filter((d) => DOMEINEN.includes(d)));
    setNiveau(profiel.niveau);
    setMethodes(profiel.methodes);
  }, [profiel]);

  if (!data) return null;

  const wisselMethode = (m: MethodeId) =>
    setMethodes((huidig) => (huidig.includes(m) ? huidig.filter((x) => x !== m) : [...huidig, m]));

  const wissel = (d: string) =>
    setDomeinen((huidig) => (huidig.includes(d) ? huidig.filter((x) => x !== d) : [...huidig, d]));

  const opslaan = () => {
    // Altijd in de vaste volgorde opslaan, ongeacht de volgorde van aanklikken.
    const geordend = METHODE_IDS.filter((m) => methodes.includes(m));
    wijzig((d) => ({ ...d, profiel: { domeinen, niveau, methodes: geordend } }));
    router.push(profiel ? "/profiel" : "/leren");
  };

  return (
    <>
      <div className="kop">
        <span className="label">{profiel ? "Voorkeuren" : "Welkom"}</span>
        <h1>Even kennismaken</h1>
      </div>

      <section className="sectie">
        <h2>Welke vakgebieden interesseren je?</h2>
        <p className="zacht klein">Kies er zoveel als je wilt.</p>
        <div className="raster">
          {DOMEINEN.map((d) => (
            <button key={d} className="tegel" onClick={() => wissel(d)} aria-pressed={domeinen.includes(d)}>
              <span className="illustratie">
                <Illustratie domein={d} />
              </span>
              {d}
            </button>
          ))}
        </div>
      </section>

      <section className="sectie">
        <h2>Welk niveau?</h2>
        <div className="keuzes" role="radiogroup" aria-label="Niveau">
          {NIVEAUS.map((n) => (
            <button
              key={n.id}
              role="radio"
              aria-checked={niveau === n.id}
              className={`keuze ${niveau === n.id ? "gekozen" : ""}`}
              onClick={() => setNiveau(n.id)}
            >
              <span>
                <strong>{n.naam}</strong>
                <span className="zacht"> · {n.uitleg}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="sectie">
        <h2>Hoe wil je leren?</h2>
        <p className="zacht klein">
          Vink een of meer manieren aan; je krijgt dan alleen die te zien. Kies je er meer dan één, dan zoekt de app uit
          welke daarvan voor jou het beste werkt.
        </p>
        <div className="keuzes" role="group" aria-label="Leermethodes">
          {METHODE_IDS.map((m) => (
            <button
              key={m}
              role="checkbox"
              aria-checked={methodes.includes(m)}
              className={`keuze ${methodes.includes(m) ? "gekozen" : ""}`}
              onClick={() => wisselMethode(m)}
            >
              <span className="vinkje" aria-hidden="true" />
              <span>
                <strong>{METHODES[m].naam}</strong>
                <span className="zacht"> · {METHODES[m].korteUitleg}</span>
              </span>
            </button>
          ))}
          <button
            role="checkbox"
            aria-checked={methodes.length === 0}
            className={`keuze ${methodes.length === 0 ? "gekozen" : ""}`}
            onClick={() => setMethodes([])}
          >
            <span className="vinkje" aria-hidden="true" />
            <span>
              <strong>Ik weet het niet</strong>
              <span className="zacht"> · wissel alle vier af en ontdek wat werkt</span>
            </span>
          </button>
        </div>
      </section>

      <button className="knop breed" onClick={opslaan} disabled={domeinen.length === 0}>
        {profiel ? "Opslaan" : "Beginnen"}
      </button>
    </>
  );
}
