"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { analyseer, MIN_METINGEN } from "@/lib/experiment";
import { gekozenMethodes, METHODES } from "@/lib/methodes";
import { nu, useAppData } from "@/lib/opslag";
import { DAG, teHerhalen } from "@/lib/srs";
import { aantalOver, DOMEINEN } from "@/lib/woordenbank";
import { DomeinLijst } from "./components/DomeinLijst";

function procent(x: number | null) {
  return x === null ? "–" : `${Math.round(x * 100)}%`;
}

export default function Vandaag() {
  const router = useRouter();
  const [data] = useAppData();
  if (!data) return null;

  if (!data.profiel) {
    return (
      <>
        <div className="kop">
          <span className="label">Taal-app</span>
          <h1>Welkom</h1>
        </div>
        <p className="tekst-2">
          Leer nieuwe woorden in vakgebieden die jou interesseren, van filosofie tot recht. Elk woord leer je op een
          van vier manieren: lezen, beeld, luisteren of doen. Een dag later kijkt de app wat je nog weet.
        </p>
        <p className="tekst-2">
          Zo ontdek je aan de hand van je eigen resultaten welke manier voor jou het beste werkt. Een leerstijltest
          is dus niet nodig.
        </p>
        <Link className="knop breed" href="/start">
          Aan de slag
        </Link>
      </>
    );
  }

  const kaarten = Object.values(data.kaarten);
  const klaar = teHerhalen(kaarten, nu(data));
  const methodes = gekozenMethodes(data.profiel);
  const analyse = analyseer(kaarten, Math.random, methodes);
  const bekend = new Set(Object.keys(data.woorden));
  const domeinen = data.profiel.domeinen.filter((d) => DOMEINEN.includes(d));
  const gemeten = analyse.perMethode.reduce((som, s) => som + Math.min(s.gemeten, MIN_METINGEN), 0);
  const nodig = MIN_METINGEN * analyse.perMethode.length;
  const eerstvolgende = kaarten.length > 0 ? Math.min(...kaarten.map((k) => k.volgende)) : null;
  const dagen = eerstvolgende === null ? null : Math.max(1, Math.ceil((eerstvolgende - nu(data)) / DAG));

  return (
    <>
      <div className="kop">
        <span className="label">Taal-app</span>
        <h1>Vandaag</h1>
      </div>

      {klaar.length > 0 ? (
        <div className="kaart" style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <span className="serif" style={{ fontSize: 56, lineHeight: 1, color: "var(--accent)" }}>
            {klaar.length}
          </span>
          <span style={{ flexGrow: 1, fontWeight: 600 }}>
            {klaar.length === 1 ? "woord" : "woorden"} om te herhalen
          </span>
          <Link className="knop" href="/herhalen">
            Herhalen
          </Link>
        </div>
      ) : (
        <div className="kaart">
          <p style={{ fontWeight: 600 }}>Niets te herhalen</p>
          <p className="zacht klein">
            {dagen === null
              ? "Leer je eerste woorden; een dag later komen ze hier terug."
              : `De volgende herhaling staat over ${dagen} ${dagen === 1 ? "dag" : "dagen"} klaar. Tijd voor nieuwe woorden?`}
          </p>
        </div>
      )}

      <section className="sectie">
        <h2>Nieuwe woorden</h2>
        {domeinen.length > 0 ? (
          <DomeinLijst
            domeinen={domeinen}
            over={(d) => aantalOver(d, bekend)}
            kies={(d) => router.push(`/leren?vakgebied=${encodeURIComponent(d)}`)}
            kiesMix={() => router.push("/leren?vakgebied=mix")}
          />
        ) : (
          <p className="tekst-2">
            Kies eerst je vakgebieden in je <Link href="/start">voorkeuren</Link>.
          </p>
        )}
      </section>

      <section className="sectie">
        <h2>Jouw leerexperiment</h2>
        <p className="tekst-2 klein">
          {methodes.length === 1
            ? `Je leert nu alleen via ${METHODES[methodes[0]].naam.toLowerCase()}. Vink meer methodes aan in je voorkeuren om te ontdekken wat het beste werkt.`
            : analyse.beste
              ? `Tot nu toe onthoud je woorden het best via ${METHODES[analyse.beste].naam.toLowerCase()}. Nieuwe woorden krijg je daarom vaker zo.`
              : `Nog ${nodig - gemeten} metingen tot een eerste conclusie over hoe jij het beste leert.`}
        </p>
        <div className="balk" aria-label={`${gemeten} van ${nodig} metingen`}>
          <div style={{ width: `${(gemeten / nodig) * 100}%` }} />
        </div>
        <div className="cijfers">
          {analyse.perMethode.map((s) => (
            <div key={s.methode} className="cijfer">
              <span className="waarde">{procent(s.score)}</span>
              <span className="naam">{METHODES[s.methode].naam}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
