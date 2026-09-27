"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { hoofdstukWoorden, leesAlineas, padVoortgang, vindPad } from "@/lib/leerpaden";
import { useAppData } from "@/lib/opslag";
import type { LeerPad, Woord } from "@/lib/types";
import { Illustratie } from "../../components/Illustratie";
import { IcoonTerug } from "../../components/iconen";
import { Toets } from "./Toets";

type Modus = { soort: "overzicht" } | { soort: "lees"; hoofdstuk: number } | { soort: "toets"; hoofdstuk: number };

export function PadScherm({ id }: { id: string }) {
  const [data, wijzig] = useAppData();
  const [modus, setModus] = useState<Modus>({ soort: "overzicht" });
  const pad = vindPad(id);

  if (!data) return null;
  if (!pad) {
    return (
      <p className="tekst-2">
        Dit leerpad bestaat niet (meer). <Link href="/leren">Terug naar Leren</Link>.
      </p>
    );
  }

  const bekend = new Set(Object.keys(data.woorden));
  const overzicht = () => {
    setModus({ soort: "overzicht" });
    window.scrollTo(0, 0);
  };

  if (modus.soort === "toets") {
    return (
      <Toets
        pad={pad}
        hoofdstuk={modus.hoofdstuk}
        klaar={(score) => {
          // Alleen je beste score per hoofdstuk wordt bewaard.
          wijzig((d) => {
            const oud = d.paden[pad.id]?.toets ?? {};
            const beste = Math.max(score, oud[modus.hoofdstuk] ?? 0);
            return { ...d, paden: { ...d.paden, [pad.id]: { toets: { ...oud, [modus.hoofdstuk]: beste } } } };
          });
        }}
        terug={overzicht}
      />
    );
  }

  if (modus.soort === "lees") {
    return (
      <Leestekst
        pad={pad}
        index={modus.hoofdstuk}
        bekend={bekend}
        terug={overzicht}
        toets={() => setModus({ soort: "toets", hoofdstuk: modus.hoofdstuk })}
      />
    );
  }

  const totaal = padVoortgang(pad, bekend);
  const scores = data.paden[pad.id]?.toets ?? {};

  return (
    <>
      <Link href="/leren" className="linkknop" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, marginLeft: -12 }}>
        <IcoonTerug />
        Leren
      </Link>
      <div className="kop">
        <span className="label">Leerpad · {pad.domein}</span>
        <h1>{pad.titel}</h1>
        <span className="woordsoort">
          {pad.auteur}, {pad.jaar}
        </span>
      </div>
      <div className="illustratie">
        <Illustratie domein={pad.domein} />
      </div>
      <p className="tekst-2">{pad.inleiding}</p>
      {pad.disclaimer && (
        <div className="kaart hulp" role="note">
          <p className="klein" style={{ margin: 0 }}>
            {pad.disclaimer}
          </p>
        </div>
      )}

      <section className="sectie">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2>Voortgang</h2>
          <span className="zacht klein">
            {totaal.geleerd} van {totaal.totaal} woorden
          </span>
        </div>
        <div className="balk" aria-label={`${totaal.geleerd} van ${totaal.totaal} woorden geleerd`}>
          <div style={{ width: `${(totaal.geleerd / totaal.totaal) * 100}%` }} />
        </div>
      </section>

      {pad.hoofdstukken.map((h, i) => {
        const v = padVoortgang(pad, bekend, i);
        const alles = v.geleerd === v.totaal;
        return (
          <section key={h.titel} className="kaart hoofdstuk">
            <div className="kop">
              <span className="label accent">Hoofdstuk {i + 1}</span>
              <h2 style={{ margin: 0 }}>{h.titel}</h2>
            </div>
            <p className="tekst-2 klein" style={{ margin: 0 }}>
              {h.inleiding}
            </p>
            <p className="zacht klein" style={{ margin: 0 }}>
              {alles ? "Alle woorden geleerd" : `${v.geleerd} van ${v.totaal} woorden geleerd`}
              {scores[i] !== undefined && ` · beste toets ${scores[i]} van ${v.totaal}`}
            </p>
            <div className="knoprij">
              {alles ? (
                <button className="knop" onClick={() => setModus({ soort: "toets", hoofdstuk: i })}>
                  Toets
                </button>
              ) : (
                <Link className="knop" href={`/leren?pad=${pad.id}&hoofdstuk=${i}`}>
                  Leer
                </Link>
              )}
              <button className="knop tweede" onClick={() => setModus({ soort: "lees", hoofdstuk: i })}>
                Lees
              </button>
            </div>
            {!alles && <p className="zacht klein" style={{ margin: 0 }}>De toets komt vrij als je alle woorden van dit hoofdstuk hebt geleerd.</p>}
          </section>
        );
      })}
    </>
  );
}

/** De leestekst van een hoofdstuk. Tik op een gemarkeerd woord om de betekenis te zien. */
function Leestekst({
  pad,
  index,
  bekend,
  terug,
  toets,
}: {
  pad: LeerPad;
  index: number;
  bekend: Set<string>;
  terug: () => void;
  toets: () => void;
}) {
  const hoofdstuk = pad.hoofdstukken[index];
  const woorden = new Map(hoofdstukWoorden(pad, hoofdstuk).map((w) => [w.woord, w]));
  // Welk woord openstaat, per alinea, zodat de uitleg direct onder de juiste alinea verschijnt.
  const [open, setOpen] = useState<{ alinea: number; woord: Woord } | null>(null);
  const v = padVoortgang(pad, bekend, index);

  return (
    <>
      <button className="linkknop" onClick={terug} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, marginLeft: -12 }}>
        <IcoonTerug />
        {pad.titel}
      </button>
      <div className="kop">
        <span className="label">Hoofdstuk {index + 1} · leestekst</span>
        <h1>{hoofdstuk.titel}</h1>
      </div>
      <p className="zacht klein" style={{ margin: 0 }}>
        Tik op een <span className="gemarkeerd nieuw voorbeeld">gemarkeerd woord</span> voor de betekenis. Woorden die je al
        kent, zijn <span className="gemarkeerd bekend voorbeeld">onderstreept</span>.
      </p>
      <article className="leestekst">
        {leesAlineas(hoofdstuk.leestekst).map((delen, a) => (
          <Fragment key={a}>
            <p>
              {delen.map((deel, d) => {
                const woord = deel.woord ? woorden.get(deel.woord) : undefined;
                if (!woord) return <Fragment key={d}>{deel.tekst}</Fragment>;
                const actief = open?.alinea === a && open.woord.id === woord.id;
                return (
                  <button
                    key={d}
                    className={`gemarkeerd ${bekend.has(woord.id) ? "bekend" : "nieuw"}`}
                    aria-expanded={actief}
                    onClick={() => setOpen(actief ? null : { alinea: a, woord })}
                  >
                    {deel.tekst}
                  </button>
                );
              })}
            </p>
            {open?.alinea === a && (
              <div className="kaart hulp uitleg" role="status">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <strong className="serif" style={{ fontSize: 22 }}>
                    {open.woord.woord}
                  </strong>
                  <span className="woordsoort" style={{ fontSize: 15 }}>
                    {open.woord.woordsoort}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{open.woord.definitie}</p>
              </div>
            )}
          </Fragment>
        ))}
      </article>
      <div className="knoprij">
        {v.geleerd < v.totaal ? (
          <Link className="knop" href={`/leren?pad=${pad.id}&hoofdstuk=${index}`}>
            Leer deze woorden
          </Link>
        ) : (
          <button className="knop" onClick={toets}>
            Doe de toets
          </button>
        )}
        <button className="knop tweede" onClick={terug}>
          Terug naar het leerpad
        </button>
      </div>
    </>
  );
}
