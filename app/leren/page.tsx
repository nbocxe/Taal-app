"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { kiesMethodes } from "@/lib/experiment";
import { kiesPadWoorden, PADEN, padVoortgang, vindPad } from "@/lib/leerpaden";
import { gekozenMethodes, METHODES } from "@/lib/methodes";
import { nu, useAppData } from "@/lib/opslag";
import { nieuweKaart } from "@/lib/srs";
import type { AppData, MethodeId, Woord } from "@/lib/types";
import { aantalOver, DOMEINEN, kiesMixWoorden, kiesNieuweWoorden } from "@/lib/woordenbank";
import { DomeinLijst } from "../components/DomeinLijst";
import { Illustratie } from "../components/Illustratie";
import { IcoonPijl, METHODE_ICONEN } from "../components/iconen";
import { Sessiekop } from "../components/Sessiekop";
import { useSessieModus } from "../components/TabBalk";
import { Dictee } from "./Dictee";
import { Beeld, Doen, Lezen, Luisteren } from "./methodes";

const PER_RONDE = 5;

const COMPONENTEN = { lezen: Lezen, beeld: Beeld, luisteren: Luisteren, doen: Doen };

interface Ronde {
  woorden: Woord[];
  methodes: MethodeId[];
  positie: number;
  /** Uitslag van de spellingoefening per kaart (true = goed), als die aan staat. */
  spelling: Record<number, boolean>;
  /** Gezet als de ronde bij een hoofdstuk van een leerpad hoort. */
  pad?: { id: string; hoofdstuk: number };
}

/** Speciale waarde voor een ronde met woorden uit al je vakgebieden door elkaar. */
const MIX = "mix";

function nieuweRonde(data: AppData, keuze: string, pad?: Ronde["pad"]): Ronde {
  const profiel = data.profiel!;
  const bekend = new Set(Object.keys(data.woorden));
  const leerpad = pad && vindPad(pad.id);
  const woorden = leerpad
    ? // Bij een leerpad leer je de woorden van het hoofdstuk in de volgorde van het verhaal.
      kiesPadWoorden(leerpad, pad.hoofdstuk, bekend)
    : keuze === MIX
      ? kiesMixWoorden(profiel.domeinen.filter((d) => DOMEINEN.includes(d)), profiel.niveau, bekend, PER_RONDE)
      : kiesNieuweWoorden(keuze, profiel.niveau, bekend, PER_RONDE);
  // Alleen de leermethodes die je zelf hebt aangevinkt (of alle vier bij "ik weet het niet").
  const methodes = kiesMethodes(Object.values(data.kaarten), woorden.length, Math.random, gekozenMethodes(profiel));
  return { woorden, methodes, positie: 0, spelling: {}, ...(leerpad && { pad }) };
}

function LerenScherm() {
  const [data, wijzig] = useAppData();
  const [ronde, setRonde] = useState<Ronde | null>(null);
  const router = useRouter();
  const zoek = useSearchParams();
  const gevraagd = zoek.get("vakgebied");
  const gevraagdPad = vindPad(zoek.get("pad"));
  const gevraagdHoofdstuk = Number(zoek.get("hoofdstuk") ?? 0);
  const bezig = ronde !== null && ronde.positie < ronde.woorden.length;
  useSessieModus(bezig);

  // Vanaf het startscherm kun je direct een vakgebied kiezen: dan begint de ronde meteen.
  // Vanuit een leerpad begint meteen een ronde met de woorden van dat hoofdstuk.
  useEffect(() => {
    if (!data?.profiel || ronde !== null) return;
    if (gevraagdPad) {
      setRonde(nieuweRonde(data, gevraagdPad.domein, { id: gevraagdPad.id, hoofdstuk: gevraagdHoofdstuk }));
      window.history.replaceState(null, "", window.location.pathname);
    } else if (gevraagd && (gevraagd === MIX || DOMEINEN.includes(gevraagd))) {
      setRonde(nieuweRonde(data, gevraagd));
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [data, gevraagd, gevraagdPad, gevraagdHoofdstuk, ronde]);

  if (!data) return null;
  if (!data.profiel) {
    return (
      <p className="tekst-2">
        Vertel eerst wat je wilt leren: <Link href="/start">aan de slag</Link>.
      </p>
    );
  }

  // Alleen vakgebieden die in de woordenbank staan (oudere voorkeuren kunnen andere bevatten).
  const domeinen = data.profiel.domeinen.filter((d) => DOMEINEN.includes(d));
  const bekend = new Set(Object.keys(data.woorden));

  // Pas als je een woord helemaal doorlopen hebt, komt het in je herhaallijst.
  const woordKlaar = () => {
    if (!ronde) return;
    const woord = ronde.woorden[ronde.positie];
    const methode = ronde.methodes[ronde.positie];
    // Ben je teruggegaan naar een woord dat al is opgeslagen, dan laten we de meting ongemoeid.
    wijzig((d) =>
      d.kaarten[woord.id]
        ? d
        : {
            ...d,
            woorden: { ...d.woorden, [woord.id]: woord },
            kaarten: {
              ...d.kaarten,
              [woord.id]: {
                ...nieuweKaart(woord.id, methode, nu(d)),
                ...(ronde.positie in ronde.spelling && { spelling: ronde.spelling[ronde.positie] ? "goed" : "fout" }),
              },
            },
          },
    );
    setRonde({ ...ronde, positie: ronde.positie + 1 });
  };

  if (ronde && bezig) {
    const woord = ronde.woorden[ronde.positie];
    const methode = ronde.methodes[ronde.positie];
    const Component = COMPONENTEN[methode];
    const alGezien = woord.id in data.kaarten;
    // Met de spellingoefening aan begint elke nieuwe kaart met luisteren en zelf schrijven.
    const dictee = data.instellingen.spellingoefening && !alGezien && !(ronde.positie in ronde.spelling);
    return (
      <>
        <Sessiekop
          positie={ronde.positie}
          totaal={ronde.woorden.length}
          stop={() => (ronde.pad ? router.push(`/paden/${ronde.pad.id}/`) : setRonde(null))}
          terug={() => setRonde({ ...ronde, positie: Math.max(0, ronde.positie - 1) })}
        />
        <div className="kaartkop">
          <span className="label accent" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {dictee ? METHODE_ICONEN.doen : METHODE_ICONEN[methode]}
            {dictee ? "Spelling" : METHODES[methode].naam}
          </span>
          <span className="label vakgebied">{woord.domein}</span>
        </div>
        <div className="illustratie">
          <Illustratie domein={woord.domein} />
        </div>
        {dictee ? (
          <Dictee
            key={`dictee-${woord.id}`}
            woord={woord}
            klaar={(goed) => setRonde({ ...ronde, spelling: { ...ronde.spelling, [ronde.positie]: goed } })}
          />
        ) : (
          <Component key={woord.id} woord={woord} klaar={woordKlaar} alGezien={alGezien} />
        )}
      </>
    );
  }

  if (ronde) {
    const leerpad = ronde.pad && vindPad(ronde.pad.id);
    return (
      <>
        <div className="kop">
          <span className="label">Ronde klaar</span>
          <h1>Goed gedaan</h1>
        </div>
        <p className="tekst-2">
          Morgen komen deze woorden terug in een korte overhoring. Dan zie je welke methode het beste bleef hangen.
        </p>
        <div className="lijst">
          {ronde.woorden.map((w, i) => (
            <div key={w.id} className="regel" style={{ cursor: "default" }}>
              <span className="groei">
                <span className="titel serif" style={{ fontSize: 20 }}>
                  {w.woord}
                </span>
                <span className="sub">via {METHODES[ronde.methodes[i]].naam.toLowerCase()}</span>
              </span>
            </div>
          ))}
        </div>
        {ronde.woorden.length === 0 && (
          <p className="tekst-2">Je kent alle woorden van dit hoofdstuk al. Tijd voor de toets?</p>
        )}
        <div className="knoprij">
          {leerpad ? (
            <Link className="knop" href={`/paden/${leerpad.id}/`}>
              Terug naar het leerpad
            </Link>
          ) : (
            <button className="knop" onClick={() => setRonde(null)}>
              Nog een ronde
            </button>
          )}
          <Link className="knop tweede" href="/">
            Naar Vandaag
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="kop">
        <span className="label">Leren</span>
        <h1>Nieuwe woorden</h1>
      </div>
      <p className="tekst-2">
        Kies een vakgebied, of een mix van al je vakgebieden. Je krijgt {PER_RONDE} nieuwe woorden via de
        leermethodes die je hebt gekozen.
      </p>
      {domeinen.length > 0 ? (
        <DomeinLijst
          domeinen={domeinen}
          over={(d) => aantalOver(d, bekend)}
          kies={(d) => setRonde(nieuweRonde(data, d))}
          kiesMix={() => setRonde(nieuweRonde(data, MIX))}
        />
      ) : (
        <p className="tekst-2">Je hebt nog geen vakgebieden gekozen.</p>
      )}

      <section className="sectie">
        <h2>Leerpaden</h2>
        <p className="tekst-2 klein" style={{ margin: 0 }}>
          Leer de woorden uit een bekende bron, hoofdstuk voor hoofdstuk, met een leestekst en een toets.
        </p>
        <div className="lijst">
          {/* Paden uit je eigen vakgebieden eerst. */}
          {[...PADEN]
            .sort((a, b) => Number(!domeinen.includes(a.domein)) - Number(!domeinen.includes(b.domein)))
            .map((pad) => {
              const v = padVoortgang(pad, bekend);
              return (
                <Link key={pad.id} className="regel" href={`/paden/${pad.id}/`}>
                  <span className="duim">
                    <Illustratie domein={pad.domein} />
                  </span>
                  <span className="groei">
                    <span className="titel">{pad.titel}</span>
                    <span className="sub">
                      {pad.auteur} · {v.geleerd} van {v.totaal} woorden
                    </span>
                  </span>
                  <span className="zacht">
                    <IcoonPijl />
                  </span>
                </Link>
              );
            })}
        </div>
      </section>

      <p className="zacht klein">
        Andere vakgebieden of een ander niveau? <Link href="/start">Pas je voorkeuren aan</Link>.
      </p>
    </>
  );
}

export default function Leren() {
  return (
    <Suspense>
      <LerenScherm />
    </Suspense>
  );
}
