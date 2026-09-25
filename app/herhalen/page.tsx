"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nu, useAppData } from "@/lib/opslag";
import { teHerhalen, verwerkAntwoord } from "@/lib/srs";

function schud<T>(lijst: T[]): T[] {
  const kopie = [...lijst];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

const WEET_NIET = "__weet-niet__";

export default function Herhalen() {
  const [data, wijzig] = useAppData();
  // De lijst wordt één keer vastgelegd, zodat woorden niet verspringen terwijl je bezig bent.
  const [rij, setRij] = useState<string[] | null>(null);
  const [positie, setPositie] = useState(0);
  const [opties, setOpties] = useState<string[]>([]);
  const [gekozen, setGekozen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (data && rij === null) {
      setRij(teHerhalen(Object.values(data.kaarten), nu(data)).map((k) => k.woordId));
    }
  }, [data, rij]);

  const woordId = rij?.[positie];
  const woord = woordId && data ? data.woorden[woordId] : undefined;

  // Nieuwe antwoordvolgorde per woord; afhankelijk van het id zodat opslaan niet opnieuw schudt.
  useEffect(() => {
    if (woord) setOpties(schud([woord.definitie, ...woord.afleiders]));
    setGekozen(null);
  }, [woordId]);

  if (!data || rij === null) return null;

  if (rij.length === 0) {
    return (
      <div className="kaart">
        <h1>Niets te herhalen</h1>
        <p>Nieuwe woorden komen een dag nadat je ze leerde terug.</p>
        <Link className="knop" href="/leren">
          Nieuwe woorden leren
        </Link>
      </div>
    );
  }

  if (positie >= rij.length || !woord) {
    return (
      <div className="kaart">
        <h1>Herhaling klaar</h1>
        <p>
          Je wist er {score} van de {rij.length}.
        </p>
        <div className="rij">
          <Link className="knop" href="/profiel">
            Bekijk je leerprofiel
          </Link>
          <Link className="knop tweede" href="/">
            Naar start
          </Link>
        </div>
      </div>
    );
  }

  const beantwoord = (keuze: string) => {
    if (gekozen) return;
    const goed = keuze === woord.definitie;
    setGekozen(keuze);
    if (goed) setScore((s) => s + 1);
    wijzig((d) => ({
      ...d,
      kaarten: { ...d.kaarten, [woord.id]: verwerkAntwoord(d.kaarten[woord.id], goed, nu(d)) },
    }));
  };

  const klasse = (optie: string) => {
    if (!gekozen) return "keuze";
    if (optie === woord.definitie) return "keuze juist";
    if (optie === gekozen) return "keuze onjuist";
    return "keuze";
  };

  return (
    <>
      <p className="zacht">
        {positie + 1} van {rij.length}
      </p>
      <div className="kaart">
        <p className="groot">{woord.woord}</p>
        <p className="zacht">Wat betekent dit?</p>
        {opties.map((optie) => (
          <button key={optie} className={klasse(optie)} onClick={() => beantwoord(optie)} disabled={!!gekozen}>
            {optie}
          </button>
        ))}
        <button
          className={`keuze ${gekozen === WEET_NIET ? "onjuist" : ""}`}
          onClick={() => beantwoord(WEET_NIET)}
          disabled={!!gekozen}
        >
          Ik weet het niet
        </button>

        {gekozen && (
          <>
            <p className={gekozen === woord.definitie ? "goed" : "fout"}>
              <strong>{gekozen === woord.definitie ? "Goed!" : "Helaas."}</strong>{" "}
              <em>“{woord.voorbeeldzin}”</em>
            </p>
            <button onClick={() => setPositie((p) => p + 1)}>Volgende</button>
          </>
        )}
      </div>
    </>
  );
}
