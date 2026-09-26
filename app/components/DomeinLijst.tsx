import { Illustratie } from "./Illustratie";
import { IcoonPijl } from "./iconen";

/** Lijst met vakgebieden, elk met een kleine tekening en het aantal woorden dat nog te leren is. */
export function DomeinLijst({
  domeinen,
  over,
  kies,
  kiesMix,
}: {
  domeinen: string[];
  over: (domein: string) => number;
  kies: (domein: string) => void;
  /** Toont bovenaan de optie om woorden uit al je vakgebieden door elkaar te leren. */
  kiesMix?: () => void;
}) {
  const totaal = domeinen.reduce((som, d) => som + over(d), 0);
  return (
    <div className="lijst">
      {kiesMix && domeinen.length > 1 && (
        <button className="regel" onClick={kiesMix} disabled={totaal === 0}>
          <span className="duim">
            <Illustratie domein="mix" />
          </span>
          <span className="groei">
            <span className="titel">Mix van mijn vakgebieden</span>
            <span className="sub">Woorden uit al je {domeinen.length} vakgebieden door elkaar</span>
          </span>
          {totaal > 0 && (
            <span className="zacht">
              <IcoonPijl />
            </span>
          )}
        </button>
      )}
      {domeinen.map((domein) => {
        const aantal = over(domein);
        return (
          <button key={domein} className="regel" onClick={() => kies(domein)} disabled={aantal === 0}>
            <span className="duim">
              <Illustratie domein={domein} />
            </span>
            <span className="groei">
              <span className="titel">{domein}</span>
              <span className="sub">{aantal > 0 ? `${aantal} woorden te gaan` : "Alles geleerd"}</span>
            </span>
            {aantal > 0 && (
              <span className="zacht">
                <IcoonPijl />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
