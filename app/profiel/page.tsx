"use client";

import Link from "next/link";
import { analyseer, MIN_METINGEN } from "@/lib/experiment";
import { METHODES } from "@/lib/methodes";
import { exporteer, nu, useAppData } from "@/lib/opslag";
import { DAG } from "@/lib/srs";

function procent(x: number | null) {
  return x === null ? "–" : `${Math.round(x * 100)}%`;
}

export default function Profiel() {
  const [data, wijzig] = useAppData();
  if (!data) return null;

  const kaarten = Object.values(data.kaarten);
  const analyse = analyseer(kaarten);
  const voorkeur = data.profiel?.voorkeur;

  const download = () => {
    const blob = new Blob([exporteer(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "taal-app-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <h1>Mijn leerprofiel</h1>

      <div className="kaart">
        <p className="label">Wat werkt voor jou?</p>
        {analyse.beste ? (
          <p>
            Woorden die je via <strong>{METHODES[analyse.beste].naam}</strong> leerde, wist je een dag later het
            vaakst nog. De app biedt nieuwe woorden daarom vaker zo aan, maar blijft de andere methodes af en toe
            proberen. Zo merkt hij het als er iets verandert.
          </p>
        ) : (
          <p>
            Nog te weinig gegevens. Per methode zijn minstens {MIN_METINGEN} woorden nodig die je een dag later
            herhaald hebt. Blijf leren én herhalen!
          </p>
        )}
        {voorkeur && voorkeur !== "weet-niet" && analyse.beste && (
          <p>
            Je dacht zelf dat <strong>{METHODES[voorkeur].naam}</strong> het beste zou werken.{" "}
            {voorkeur === analyse.beste
              ? "Dat klopt dus!"
              : "Je resultaten wijzen iets anders uit. Onze eigen indruk van hoe we leren klopt vaak niet."}
          </p>
        )}
      </div>

      <div className="kaart">
        <p className="label">Per methode</p>
        <div className="tabel">
        <table>
          <thead>
            <tr>
              <th>Methode</th>
              <th>Geleerd</th>
              <th>Gemeten</th>
              <th>Geweten</th>
              <th>Kans beste</th>
            </tr>
          </thead>
          <tbody>
            {analyse.perMethode.map((s) => (
              <tr key={s.methode}>
                <td>{METHODES[s.methode].naam}</td>
                <td>{s.geleerd}</td>
                <td>{s.gemeten}</td>
                <td>{procent(s.score)}</td>
                <td>{s.gemeten > 0 ? procent(s.kansBeste) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <p className="zacht">
          “Gemeten” telt woorden die je minstens een dag na het leren voor het eerst herhaalde. “Geweten” is
          hoeveel daarvan je toen nog wist. “Kans beste” is
          een schatting van hoe zeker het is dat die methode echt je beste is. Met weinig metingen ligt dat nog
          dicht bij elkaar.
        </p>
      </div>

      <div className="kaart">
        <p className="label">Testmodus</p>
        <p className="zacht">
          Wil je de herhalingen uitproberen zonder te wachten? Laat de app denken dat er een dag voorbij is.
          {data.klokVerschuiving > 0 &&
            ` De klok staat nu ${Math.round(data.klokVerschuiving / DAG)} ${data.klokVerschuiving === DAG ? "dag" : "dagen"} vooruit.`}
        </p>
        <div className="rij">
          <button
            className="tweede"
            onClick={() => wijzig((d) => ({ ...d, klokVerschuiving: d.klokVerschuiving + DAG }))}
          >
            Spring 1 dag vooruit
          </button>
          {data.klokVerschuiving > 0 && (
            <button className="tweede" onClick={() => wijzig((d) => ({ ...d, klokVerschuiving: 0 }))}>
              Klok terugzetten
            </button>
          )}
        </div>
        <p className="zacht">Huidige app-tijd: {new Date(nu(data)).toLocaleString("nl-NL")}</p>
      </div>

      <div className="kaart">
        <p className="label">Gegevens</p>
        <p className="zacht">
          Alles staat alleen in deze browser. Maak af en toe een back-up.
        </p>
        <div className="rij">
          <button className="tweede" onClick={download}>
            Download back-up
          </button>
          <Link className="knop tweede" href="/start">
            Voorkeuren aanpassen
          </Link>
        </div>
      </div>
    </>
  );
}
