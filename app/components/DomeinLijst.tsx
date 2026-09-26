import { Illustratie } from "./Illustratie";
import { IcoonPijl } from "./iconen";

/** Lijst met vakgebieden, elk met een kleine tekening en het aantal woorden dat nog te leren is. */
export function DomeinLijst({
  domeinen,
  over,
  kies,
}: {
  domeinen: string[];
  over: (domein: string) => number;
  kies: (domein: string) => void;
}) {
  return (
    <div className="lijst">
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
