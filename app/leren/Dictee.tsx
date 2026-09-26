"use client";

// Optionele spellingoefening aan het begin van elke woordkaart: je hoort het woord en schrijft het zelf.
import { useEffect, useRef, useState } from "react";
import { kanVoorlezen, spreek } from "@/lib/spraak";
import { controleer, verschil, type Uitslag } from "@/lib/spelling";
import type { Woord } from "@/lib/types";
import { IcoonLuister } from "../components/iconen";

export function Dictee({ woord, klaar }: { woord: Woord; klaar: (goed: boolean) => void }) {
  const [invoer, setInvoer] = useState("");
  const [uitslag, setUitslag] = useState<Uitslag | null>(null);
  const [bezig, setBezig] = useState(false);
  const [voorlezen, setVoorlezen] = useState(true);
  const veld = useRef<HTMLInputElement>(null);

  const luister = (tempo: number) => {
    setBezig(true);
    // Vangnet voor browsers die nooit melden dat het voorlezen klaar is.
    const vangnet = setTimeout(() => setBezig(false), 6000);
    spreek(woord.woord, () => {
      clearTimeout(vangnet);
      setBezig(false);
      veld.current?.focus();
    }, tempo);
  };

  // Meteen één keer voorlezen zodra de kaart verschijnt.
  useEffect(() => {
    if (!kanVoorlezen()) {
      setVoorlezen(false);
      return;
    }
    luister(0.9);
    return () => window.speechSynthesis?.cancel();
  }, [woord.id]);

  const controleren = () => {
    if (uitslag) return;
    setUitslag(controleer(invoer, woord.woord));
  };

  if (!voorlezen) {
    return (
      <>
        <div className="kaart" style={{ gap: 8 }}>
          <span className="label">Spelling</span>
          <p className="tekst-2">
            Je browser kan geen woorden voorlezen, daarom slaan we de spellingoefening bij dit woord over.
          </p>
        </div>
        <div className="duw" />
        <button className="knop breed" onClick={() => klaar(false)}>
          Verder met het woord
        </button>
      </>
    );
  }

  const goed = uitslag === "goed" || uitslag === "hoofdletters";

  return (
    <>
      <div className="kaart" style={{ alignItems: "center", textAlign: "center", padding: "24px 18px" }}>
        <p className="serif" style={{ fontSize: 22 }}>
          Luister en schrijf het woord
        </p>
        <p className="zacht klein">Het woord blijft verborgen. Denk na over hoe je het schrijft.</p>
        <div className="knoprij" style={{ justifyContent: "center" }}>
          <button className="knop" onClick={() => luister(0.9)} disabled={bezig}>
            <IcoonLuister />
            {bezig ? "Aan het voorlezen…" : "Luister"}
          </button>
          <button className="knop tweede" onClick={() => luister(0.55)} disabled={bezig}>
            Langzamer
          </button>
        </div>
      </div>

      <form
        className="sectie"
        style={{ gap: 6 }}
        onSubmit={(e) => {
          e.preventDefault();
          controleren();
        }}
      >
        <label htmlFor="dictee" className="tekst-2 klein">
          Typ wat je hoort ({woord.woordsoort})
        </label>
        <input
          id="dictee"
          ref={veld}
          className="invoer"
          type="text"
          value={invoer}
          onChange={(e) => setInvoer(e.target.value)}
          readOnly={uitslag !== null}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
        />
      </form>

      {uitslag && (
        <div className={`kaart ${goed ? "uitslag-goed" : "uitslag-fout"}`} role="status" style={{ gap: 8 }}>
          {goed ? (
            <>
              <strong className="goed">Goed geschreven!</strong>
              {uitslag === "hoofdletters" && (
                <p className="tekst-2 klein">Let alleen op de hoofdletters: het is “{woord.woord}”.</p>
              )}
            </>
          ) : (
            <>
              <strong className="fout">{invoer.trim() ? "Niet helemaal goed" : "Zo schrijf je het"}</strong>
              {invoer.trim() && (
                <p className="tekst-2 klein">
                  Jij schreef: <span className="doorgestreept">{invoer.trim()}</span>
                </p>
              )}
              <p className="spelling" aria-label={`Juiste spelling: ${woord.woord}`}>
                {verschil(invoer, woord.woord).map((stukje, i) =>
                  stukje.anders ? <mark key={i}>{stukje.tekst}</mark> : <span key={i}>{stukje.tekst}</span>,
                )}
              </p>
              {invoer.trim() && <p className="zacht klein">De gemarkeerde letters had je anders of niet geschreven.</p>}
            </>
          )}
        </div>
      )}

      <div className="duw" />
      {uitslag ? (
        <button className="knop breed" onClick={() => klaar(goed)}>
          Verder met het woord
        </button>
      ) : (
        <>
          <button className="knop breed" onClick={controleren} disabled={invoer.trim().length === 0}>
            Controleer
          </button>
          <button className="linkknop" onClick={() => setUitslag("fout")}>
            Ik weet het niet
          </button>
        </>
      )}
    </>
  );
}
