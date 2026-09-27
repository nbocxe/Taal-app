"use client";

import { useState } from "react";
import { hoofdstukWoorden } from "@/lib/leerpaden";
import type { LeerPad } from "@/lib/types";
import { kiesAfleiders } from "@/lib/woordenbank";
import { Sessiekop } from "../../components/Sessiekop";
import { useSessieModus } from "../../components/TabBalk";

function schud<T>(lijst: T[]): T[] {
  const kopie = [...lijst];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

/**
 * Meerkeuzetoets over de woorden van een hoofdstuk.
 * Dit is een extra oefening: het herhaalschema en het leerexperiment blijven onaangeroerd, zodat de metingen eerlijk blijven.
 */
export function Toets({
  pad,
  hoofdstuk,
  klaar,
  terug,
}: {
  pad: LeerPad;
  hoofdstuk: number;
  klaar: (score: number) => void;
  terug: () => void;
}) {
  // Vragen en antwoordvolgorde liggen bij de start vast, zodat je kunt terugbladeren.
  const [vragen, setVragen] = useState(() =>
    schud(hoofdstukWoorden(pad, pad.hoofdstukken[hoofdstuk])).map((woord) => ({
      woord,
      opties: schud([woord.definitie, ...kiesAfleiders(woord)]),
    })),
  );
  const [positie, setPositie] = useState(0);
  const [antwoorden, setAntwoorden] = useState<Record<number, string>>({});
  const bezig = positie < vragen.length;
  useSessieModus(bezig);

  const score = vragen.filter((v, i) => antwoorden[i] === v.woord.definitie).length;

  if (!bezig) {
    return (
      <>
        <div className="kop">
          <span className="label">Toets · {pad.hoofdstukken[hoofdstuk].titel}</span>
          <h1>
            {score} van de {vragen.length} goed
          </h1>
        </div>
        <p className="tekst-2">
          {score === vragen.length
            ? "Alles goed. Deze woorden zitten erin."
            : "De woorden die je nog lastig vond, komen vanzelf terug in je herhalingen."}
        </p>
        <div className="knoprij">
          <button className="knop" onClick={terug}>
            Terug naar het leerpad
          </button>
          <button
            className="knop tweede"
            onClick={() => {
              setVragen((vs) => schud(vs).map((v) => ({ ...v, opties: schud(v.opties) })));
              setAntwoorden({});
              setPositie(0);
            }}
          >
            Nog een keer
          </button>
        </div>
      </>
    );
  }

  const { woord, opties } = vragen[positie];
  const gekozen = antwoorden[positie] ?? null;
  const goed = gekozen === woord.definitie;

  const kies = (optie: string) => {
    if (gekozen) return;
    setAntwoorden((a) => ({ ...a, [positie]: optie }));
  };

  const volgende = () => {
    const nieuw = positie + 1;
    if (nieuw >= vragen.length) klaar(score);
    setPositie(nieuw);
  };

  const klasse = (optie: string) => {
    if (!gekozen) return "keuze";
    if (optie === woord.definitie) return "keuze juist";
    if (optie === gekozen) return "keuze onjuist";
    return "keuze";
  };

  return (
    <>
      <Sessiekop
        positie={positie}
        totaal={vragen.length}
        stop={terug}
        terug={() => setPositie((p) => Math.max(0, p - 1))}
      />
      <div className="kop">
        <span className="label">Toets · {pad.hoofdstukken[hoofdstuk].titel}</span>
        <h1 className="woord">{woord.woord}</h1>
        <span className="woordsoort">Wat betekent dit?</span>
      </div>
      <div className="keuzes">
        {opties.map((optie) => (
          <button key={optie} className={klasse(optie)} onClick={() => kies(optie)} disabled={!!gekozen}>
            {optie}
          </button>
        ))}
      </div>

      <div className="duw" />
      {gekozen && (
        <div className="onderbalk">
          <div className={`melding ${goed ? "goed" : "fout"}`} role="status">
            <strong>{goed ? "Goed!" : "Helaas."}</strong>
            <p className="citaat">“{woord.voorbeeldzin}”</p>
          </div>
          <button className="knop breed" onClick={volgende}>
            {positie + 1 < vragen.length ? "Volgende" : "Afronden"}
          </button>
        </div>
      )}
    </>
  );
}
