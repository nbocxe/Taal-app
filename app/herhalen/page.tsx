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
  // Per vraag bewaren we de antwoordvolgorde en je keuze, zodat je terug kunt bladeren.
  // Een vraag die je al beantwoord hebt, kun je bekijken maar niet opnieuw beantwoorden:
  // anders zou de meting voor het experiment niet meer kloppen.
  const [opties, setOpties] = useState<Record<number, string[]>>({});
  const [antwoorden, setAntwoorden] = useState<Record<number, string>>({});
  const router = useRouter();
  useSessieModus(rij !== null && positie < rij.length);

  useEffect(() => {
    if (data && rij === null) {
      setRij(teHerhalen(Object.values(data.kaarten), nu(data)).map((k) => k.woordId));
    }
  }, [data, rij]);

  const woordId = rij?.[positie];
  const woord = woordId && data ? data.woorden[woordId] : undefined;

  useEffect(() => {
    if (woord && !opties[positie]) {
      setOpties((o) => ({ ...o, [positie]: schud([woord.definitie, ...kiesAfleiders(woord)]) }));
    }
  }, [woord, positie, opties]);

  const gekozen = antwoorden[positie] ?? null;
  const score =
    rij?.filter((id, i) => data && antwoorden[i] !== undefined && antwoorden[i] === data.woorden[id]?.definitie)
      .length ?? 0;

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
    setAntwoorden((a) => ({ ...a, [positie]: keuze }));
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
      <Sessiekop
        positie={positie}
        totaal={rij.length}
        stop={() => router.push("/")}
        terug={() => setPositie((p) => Math.max(0, p - 1))}
      />
      <div className="kop">
        <span className="label">{woord.domein}</span>
        <h1 className="woord">{woord.woord}</h1>
        <span className="woordsoort">Wat betekent dit?</span>
      </div>
      <div className="keuzes">
        {(opties[positie] ?? []).map((optie) => (
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
