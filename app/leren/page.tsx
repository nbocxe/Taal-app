"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { kiesMethodes } from "@/lib/experiment";
import { METHODES } from "@/lib/methodes";
import { nu, useAppData } from "@/lib/opslag";
import { nieuweKaart } from "@/lib/srs";
import type { AppData, MethodeId, Woord } from "@/lib/types";
import { aantalOver, DOMEINEN, kiesNieuweWoorden } from "@/lib/woordenbank";
import { DomeinLijst } from "../components/DomeinLijst";
import { Illustratie } from "../components/Illustratie";
import { METHODE_ICONEN } from "../components/iconen";
import { Sessiekop } from "../components/Sessiekop";
import { useSessieModus } from "../components/TabBalk";
import { Beeld, Doen, Lezen, Luisteren } from "./methodes";

const PER_RONDE = 5;

const COMPONENTEN = { lezen: Lezen, beeld: Beeld, luisteren: Luisteren, doen: Doen };

interface Ronde {
  woorden: Woord[];
  methodes: MethodeId[];
  positie: number;
}

function nieuweRonde(data: AppData, domein: string): Ronde {
  const bekend = new Set(Object.keys(data.woorden));
  const woorden = kiesNieuweWoorden(domein, data.profiel!.niveau, bekend, PER_RONDE);
  return { woorden, methodes: kiesMethodes(Object.values(data.kaarten), woorden.length), positie: 0 };
}

function LerenScherm() {
  const [data, wijzig] = useAppData();
  const [ronde, setRonde] = useState<Ronde | null>(null);
  const gevraagd = useSearchParams().get("vakgebied");
  const bezig = ronde !== null && ronde.positie < ronde.woorden.length;
  useSessieModus(bezig);

  // Vanaf het startscherm kun je direct een vakgebied kiezen: dan begint de ronde meteen.
  useEffect(() => {
    if (data?.profiel && gevraagd && DOMEINEN.includes(gevraagd) && ronde === null) {
      setRonde(nieuweRonde(data, gevraagd));
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [data, gevraagd, ronde]);

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
            kaarten: { ...d.kaarten, [woord.id]: nieuweKaart(woord.id, methode, nu(d)) },
          },
    );
    setRonde({ ...ronde, positie: ronde.positie + 1 });
  };

  if (ronde && bezig) {
    const woord = ronde.woorden[ronde.positie];
    const methode = ronde.methodes[ronde.positie];
    const Component = COMPONENTEN[methode];
    return (
      <>
        <Sessiekop
          positie={ronde.positie}
          totaal={ronde.woorden.length}
          stop={() => setRonde(null)}
          terug={() => setRonde({ ...ronde, positie: Math.max(0, ronde.positie - 1) })}
        />
        <span className="label accent" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {METHODE_ICONEN[methode]}
          {METHODES[methode].naam}
        </span>
        <div className="illustratie">
          <Illustratie domein={woord.domein} />
        </div>
        <Component key={woord.id} woord={woord} klaar={woordKlaar} alGezien={woord.id in data.kaarten} />
      </>
    );
  }

  if (ronde) {
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
        <div className="knoprij">
          <button className="knop" onClick={() => setRonde(null)}>
            Nog een ronde
          </button>
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
        Kies een vakgebied. Je krijgt {PER_RONDE} nieuwe woorden, elk op een eigen manier aangeboden.
      </p>
      {domeinen.length > 0 ? (
        <DomeinLijst
          domeinen={domeinen}
          over={(d) => aantalOver(d, bekend)}
          kies={(d) => setRonde(nieuweRonde(data, d))}
        />
      ) : (
        <p className="tekst-2">Je hebt nog geen vakgebieden gekozen.</p>
      )}
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
