import { IcoonSluit, IcoonTerug } from "./iconen";

/** Bovenbalk tijdens een sessie: terug, voortgang, "3 van 5" en stoppen. */
export function Sessiekop({
  positie,
  totaal,
  stop,
  terug,
}: {
  positie: number;
  totaal: number;
  stop: () => void;
  /** Naar de vorige kaart; ontbreekt of is uitgeschakeld bij de eerste. */
  terug?: () => void;
}) {
  // Bij veel woorden worden losse segmenten te smal; dan tonen we één doorlopende balk.
  const segmenten = totaal <= 12;
  return (
    <div className="sessiekop">
      <button className="icoonknop" onClick={terug} disabled={!terug || positie === 0} aria-label="Vorige">
        <IcoonTerug />
      </button>
      {segmenten ? (
        <div className="segmenten" aria-hidden="true">
          {Array.from({ length: totaal }, (_, i) => (
            <div key={i} className={i < positie ? "af" : undefined} />
          ))}
        </div>
      ) : (
        <div className="balk" style={{ flexGrow: 1 }} aria-hidden="true">
          <div style={{ width: `${(positie / totaal) * 100}%` }} />
        </div>
      )}
      <span className="zacht klein" style={{ minWidth: 48, textAlign: "right" }}>
        {Math.min(positie + 1, totaal)} van {totaal}
      </span>
      <button className="icoonknop" onClick={stop} aria-label="Stoppen">
        <IcoonSluit />
      </button>
    </div>
  );
}
