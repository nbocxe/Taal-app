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
  const verschuiving = Math.round(data.klokVerschuiving / DAG);

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
      <div className="kop">
        <span className="label">Profiel</span>
        <h1>Hoe jij leert</h1>
      </div>

      <div className="kaart">
        {analyse.beste ? (
          <p className="citaat">
            Woorden die je via <strong>{METHODES[analyse.beste].naam.toLowerCase()}</strong> leerde, wist je een dag
            later het vaakst nog.
          </p>
        ) : (
          <p className="citaat">Nog te weinig gegevens voor een conclusie.</p>
        )}
        <p className="tekst-2 klein">
          {analyse.beste
            ? "Nieuwe woorden krijg je daarom vaker zo. De andere methodes blijven af en toe terugkomen, zodat de app merkt als er iets verandert."
            : `Per methode zijn minstens ${MIN_METINGEN} woorden nodig die je een dag na het leren hebt herhaald. Blijf leren én herhalen.`}
        </p>
        {voorkeur && voorkeur !== "weet-niet" && analyse.beste && (
          <p className="tekst-2 klein">
            Je dacht zelf dat {METHODES[voorkeur].naam.toLowerCase()} het beste zou werken.{" "}
            {voorkeur === analyse.beste
              ? "Dat klopt dus."
              : "Je resultaten wijzen iets anders uit. Onze eigen indruk van hoe we leren klopt vaak niet."}
          </p>
        )}
      </div>

      <section className="sectie">
        <h2>Per methode</h2>
        <div className="kaart" style={{ gap: 16 }}>
          {analyse.perMethode.map((s) => (
            <div key={s.methode} className="sectie" style={{ gap: 4 }}>
              <div className="methoderij">
                <span>{METHODES[s.methode].naam}</span>
                <div className="balk" aria-hidden="true">
                  <div style={{ width: `${(s.score ?? 0) * 100}%` }} />
                </div>
                <span className="waarde">{procent(s.score)}</span>
              </div>
              <span className="zacht" style={{ fontSize: 13 }}>
                {s.gemeten} van {s.geleerd} gemeten
                {s.gemeten > 0 && ` · kans dat dit je beste methode is: ${procent(s.kansBeste)}`}
              </span>
            </div>
          ))}
        </div>
        <p className="zacht klein">
          “Gemeten” zijn woorden die je minstens een dag na het leren voor het eerst herhaalde. Het percentage is hoeveel
          je daarvan nog wist.
        </p>
      </section>

      <section className="sectie">
        <h2>Instellingen</h2>
        <div className="lijst">
          <Link className="regel" href="/start">
            <span className="groei">
              <span className="titel">Voorkeuren</span>
              <span className="sub">Vakgebieden, niveau en je eigen inschatting</span>
            </span>
          </Link>
          <button className="regel" onClick={download}>
            <span className="groei">
              <span className="titel">Back-up downloaden</span>
              <span className="sub">Alles staat alleen in deze browser</span>
            </span>
          </button>
        </div>
      </section>

      <section className="sectie">
        <h2>Testmodus</h2>
        <p className="zacht klein">
          Probeer de herhalingen uit zonder te wachten: laat de app denken dat er een dag voorbij is.
          {verschuiving > 0 && ` De klok staat nu ${verschuiving} ${verschuiving === 1 ? "dag" : "dagen"} vooruit.`}
        </p>
        <div className="knoprij">
          <button
            className="knop tweede"
            onClick={() => wijzig((d) => ({ ...d, klokVerschuiving: d.klokVerschuiving + DAG }))}
          >
            Spring 1 dag vooruit
          </button>
          {verschuiving > 0 && (
            <button className="knop tweede" onClick={() => wijzig((d) => ({ ...d, klokVerschuiving: 0 }))}>
              Klok terugzetten
            </button>
          )}
        </div>
        <p className="zacht" style={{ fontSize: 13 }}>
          App-tijd: {new Date(nu(data)).toLocaleString("nl-NL")}
        </p>
      </section>
    </>
  );
}
