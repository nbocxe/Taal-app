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
  const [voorkeur, setVoorkeur] = useState<MethodeId | "weet-niet">("weet-niet");

  // Bij het aanpassen van je voorkeuren beginnen we met wat je eerder koos.
  const profiel = data?.profiel;
  useEffect(() => {
    if (!profiel) return;
    setDomeinen(profiel.domeinen.filter((d) => DOMEINEN.includes(d)));
    setNiveau(profiel.niveau);
    setVoorkeur(profiel.voorkeur);
  }, [profiel]);

  if (!data) return null;

  const wissel = (d: string) =>
    setDomeinen((huidig) => (huidig.includes(d) ? huidig.filter((x) => x !== d) : [...huidig, d]));

  const opslaan = () => {
    wijzig((d) => ({ ...d, profiel: { domeinen, niveau, voorkeur } }));
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
        <h2>Hoe denk je zelf dat je het beste leert?</h2>
        <p className="zacht klein">
          Dit verandert niets aan de app. We vergelijken het later met wat je echt onthoudt, en dat is vaak verrassend.
        </p>
        <div className="keuzes" role="radiogroup" aria-label="Eigen inschatting">
          {METHODE_IDS.map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={voorkeur === m}
              className={`keuze ${voorkeur === m ? "gekozen" : ""}`}
              onClick={() => setVoorkeur(m)}
            >
              <span>
                <strong>{METHODES[m].naam}</strong>
                <span className="zacht"> · {METHODES[m].korteUitleg}</span>
              </span>
            </button>
          ))}
          <button
            role="radio"
            aria-checked={voorkeur === "weet-niet"}
            className={`keuze ${voorkeur === "weet-niet" ? "gekozen" : ""}`}
            onClick={() => setVoorkeur("weet-niet")}
          >
            Ik weet het echt niet
          </button>
        </div>
      </section>

      <button className="knop breed" onClick={opslaan} disabled={domeinen.length === 0}>
        {profiel ? "Opslaan" : "Beginnen"}
      </button>
    </>
  );
}
