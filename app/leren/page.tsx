"use client";

import Link from "next/link";
import { useState } from "react";
import { kiesMethodes } from "@/lib/experiment";
import { METHODES } from "@/lib/methodes";
import { nu, useAppData } from "@/lib/opslag";
import { nieuweKaart } from "@/lib/srs";
import type { MethodeId, Woord } from "@/lib/types";
import { aantalOver, DOMEINEN, kiesNieuweWoorden } from "@/lib/woordenbank";
import { Beeld, Doen, Lezen, Luisteren } from "./methodes";

const PER_RONDE = 5;

const COMPONENTEN = { lezen: Lezen, beeld: Beeld, luisteren: Luisteren, doen: Doen };

interface Ronde {
  woorden: Woord[];
  methodes: MethodeId[];
  positie: number;
}

export default function Leren() {
  const [data, wijzig] = useAppData();
  const [domein, setDomein] = useState<string | null>(null);
  const [ronde, setRonde] = useState<Ronde | null>(null);

  if (!data) return null;
  if (!data.profiel) {
    return (
      <p>
        Vertel eerst wat je wilt leren: <Link href="/start">aan de slag</Link>.
      </p>
    );
  }

  // Alleen vakgebieden die in de woordenbank staan (oudere voorkeuren kunnen andere bevatten).
  const domeinen = data.profiel.domeinen.filter((d) => DOMEINEN.includes(d));
  if (domeinen.length === 0) {
    return (
      <p>
        Kies eerst een of meer vakgebieden: <Link href="/start">voorkeuren aanpassen</Link>.
      </p>
    );
  }

  const gekozenDomein = domein ?? domeinen[0];
  const bekend = new Set(Object.keys(data.woorden));

  const start = () => {
    const woorden = kiesNieuweWoorden(gekozenDomein, data.profiel!.niveau, bekend, PER_RONDE);
    setRonde({ woorden, methodes: kiesMethodes(Object.values(data.kaarten), woorden.length), positie: 0 });
  };

  // Pas als je een woord helemaal doorlopen hebt, komt het in je herhaallijst.
  const woordKlaar = () => {
    if (!ronde) return;
    const woord = ronde.woorden[ronde.positie];
    const methode = ronde.methodes[ronde.positie];
    wijzig((d) => ({
      ...d,
      woorden: { ...d.woorden, [woord.id]: woord },
      kaarten: { ...d.kaarten, [woord.id]: nieuweKaart(woord.id, methode, nu(d)) },
    }));
    setRonde({ ...ronde, positie: ronde.positie + 1 });
  };

  if (ronde && ronde.positie >= ronde.woorden.length) {
    return (
      <div className="kaart">
        <h1>Klaar!</h1>
        <p>Je hebt {ronde.woorden.length} nieuwe woorden geleerd:</p>
        <ul>
          {ronde.woorden.map((w, i) => (
            <li key={w.id}>
              <strong>{w.woord}</strong> <span className="zacht">via {METHODES[ronde.methodes[i]].naam}</span>
            </li>
          ))}
        </ul>
        <p>
          Morgen komen ze terug in een korte overhoring. Dan zien we welke methode het beste bleef hangen.
        </p>
        <div className="rij">
          <button onClick={() => setRonde(null)}>Nog een ronde</button>
          <Link className="knop tweede" href="/">
            Naar start
          </Link>
        </div>
      </div>
    );
  }

  if (ronde) {
    const woord = ronde.woorden[ronde.positie];
    const methode = ronde.methodes[ronde.positie];
    const Component = COMPONENTEN[methode];
    return (
      <>
        <p className="zacht">
          Woord {ronde.positie + 1} van {ronde.woorden.length} · methode: <strong>{METHODES[methode].naam}</strong>
        </p>
        <div className="kaart">
          <Component key={woord.id} woord={woord} klaar={woordKlaar} />
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Nieuwe woorden leren</h1>
      <div className="kaart">
        <p>Kies een vakgebied. Je krijgt {PER_RONDE} nieuwe woorden, elk op een andere manier aangeboden.</p>
        <div className="rij">
          {domeinen.map((d) => (
            <button key={d} className={d === gekozenDomein ? "" : "tweede"} onClick={() => setDomein(d)}>
              {d}
            </button>
          ))}
        </div>
        {aantalOver(gekozenDomein, bekend) > 0 ? (
          <>
            <p className="zacht">Nog {aantalOver(gekozenDomein, bekend)} nieuwe woorden in dit vakgebied.</p>
            <button onClick={start}>Start</button>
          </>
        ) : (
          <p>Je hebt alle woorden in dit vakgebied al geleerd. Kies een ander vakgebied.</p>
        )}
        <p className="zacht">
          Andere vakgebieden of een ander niveau? <Link href="/start">Pas je voorkeuren aan</Link>.
        </p>
      </div>
    </>
  );
}
