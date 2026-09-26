"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nu, useAppData } from "@/lib/opslag";
import { teHerhalen, verwerkAntwoord } from "@/lib/srs";
import { kiesAfleiders } from "@/lib/woordenbank";
import { Sessiekop } from "../components/Sessiekop";
import { useSessieModus } from "../components/TabBalk";

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
  const router = useRouter();
  useSessieModus(rij !== null && positie < rij.length);

  useEffect(() => {
    if (data && rij === null) {
      setRij(teHerhalen(Object.values(data.kaarten), nu(data)).map((k) => k.woordId));
    }
  }, [data, rij]);

  const woordId = rij?.[positie];
  const woord = woordId && data ? data.woorden[woordId] : undefined;

  // Nieuwe antwoordvolgorde per woord; afhankelijk van het id zodat opslaan niet opnieuw schudt.
  useEffect(() => {
    if (woord) setOpties(schud([woord.definitie, ...kiesAfleiders(woord)]));
    setGekozen(null);
  }, [woordId]);

  if (!data || rij === null) return null;

  if (rij.length === 0) {
    return (
      <>
        <div className="kop">
          <span className="label">Herhalen</span>
          <h1>Niets te herhalen</h1>
        </div>
        <p className="tekst-2">Nieuwe woorden komen een dag nadat je ze leerde terug in een korte overhoring.</p>
        <Link className="knop breed" href="/leren">
          Nieuwe woorden leren
        </Link>
      </>
    );
  }

  if (positie >= rij.length || !woord) {
    return (
      <>
        <div className="kop">
          <span className="label">Herhaling klaar</span>
          <h1>
            {score} van de {rij.length} goed
          </h1>
        </div>
        <p className="tekst-2">
          Woorden die je wist, zie je pas later terug. Woorden die je niet wist, komen morgen opnieuw langs.
        </p>
        <div className="knoprij">
          <Link className="knop" href="/profiel">
            Bekijk je leerprofiel
          </Link>
          <Link className="knop tweede" href="/">
            Naar Vandaag
          </Link>
        </div>
      </>
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

  const goed = gekozen === woord.definitie;

  return (
    <>
      <Sessiekop positie={positie} totaal={rij.length} stop={() => router.push("/")} />
      <div className="kop">
        <span className="label">{woord.domein}</span>
        <h1 className="woord">{woord.woord}</h1>
        <span className="woordsoort">Wat betekent dit?</span>
      </div>
      <div className="keuzes">
        {opties.map((optie) => (
          <button key={optie} className={klasse(optie)} onClick={() => beantwoord(optie)} disabled={!!gekozen}>
            {optie}
          </button>
        ))}
        <button
          className={`keuze ${gekozen === WEET_NIET ? "onjuist" : ""}`}
          onClick={() => beantwoord(WEET_NIET)}
          disabled={!!gekozen}
          style={{ color: "var(--tekst-2)" }}
        >
          Ik weet het niet
        </button>
      </div>

      <div className="duw" />
      {gekozen && (
        <div className="onderbalk">
          <div className={`melding ${goed ? "goed" : "fout"}`} role="status">
            <strong>{goed ? "Goed!" : "Helaas."}</strong>
            <p className="citaat">“{woord.voorbeeldzin}”</p>
          </div>
          <button className="knop breed" onClick={() => setPositie((p) => p + 1)}>
            {positie + 1 < rij.length ? "Volgende" : "Afronden"}
          </button>
        </div>
      )}
    </>
  );
}
