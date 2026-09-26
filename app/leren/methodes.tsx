"use client";

// De vier manieren om een nieuw woord te leren. Elke component roept `klaar` aan als je verder wilt.
import { useEffect, useState } from "react";
import { spreek } from "@/lib/spraak";
import type { Woord } from "@/lib/types";
import { IcoonLuister } from "../components/iconen";

interface Props {
  woord: Woord;
  klaar: () => void;
  /** Je bent teruggegaan naar een kaart die je al had afgerond: geen wachttijd of verplichte stap meer. */
  alGezien: boolean;
}

function Kop({ woord }: { woord: Woord }) {
  return (
    <div className="kop">
      <h1 className="woord">{woord.woord}</h1>
      <span className="woordsoort">{woord.woordsoort}</span>
    </div>
  );
}

function Voorbeeld({ woord }: { woord: Woord }) {
  return <p className="citaat">“{woord.voorbeeldzin}”</p>;
}

/** Extra voorbeelden en de herkomst, voor als het woord nog niet landt. */
function MeerVoorbeelden({ woord, knoptekst }: { woord: Woord; knoptekst: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button className="linkknop" onClick={() => setOpen(true)}>
        {knoptekst}
      </button>
    );
  }
  return (
    <div className="kaart hulp" style={{ gap: 10 }}>
      <span className="label">Meer voorbeelden</span>
      <ul className="citaat">
        {[woord.voorbeeldzin, ...(woord.voorbeelden ?? [])].map((zin) => (
          <li key={zin}>{zin}</li>
        ))}
      </ul>
      <p className="tekst-2 klein">
        <strong>Herkomst:</strong> {woord.herkomst}
      </p>
    </div>
  );
}

export function Lezen({ woord, klaar }: Props) {
  return (
    <>
      <Kop woord={woord} />
      <p className="definitie">{woord.definitie}</p>
      <Voorbeeld woord={woord} />
      <p className="zacht klein">
        <span className="label" style={{ marginRight: 8 }}>
          Herkomst
        </span>
        {woord.herkomst}
      </p>
      <MeerVoorbeelden woord={woord} knoptekst="Meer voorbeelden" />
      <div className="duw" />
      <button className="knop breed" onClick={klaar}>
        Gelezen, volgende
      </button>
    </>
  );
}

const DENKTIJD = 6;

export function Beeld({ woord, klaar, alGezien }: Props) {
  const [over, setOver] = useState(alGezien ? 0 : DENKTIJD);

  useEffect(() => {
    if (over <= 0) return;
    const t = setTimeout(() => setOver((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [over]);

  return (
    <>
      <Kop woord={woord} />
      <p className="definitie">{woord.definitie}</p>
      <div className="kaart" style={{ gap: 6 }}>
        <span className="label">Stel je voor</span>
        <p className="citaat">{woord.beeld}</p>
      </div>
      <p className="zacht klein">Sluit even je ogen en zie deze scène zo levendig mogelijk voor je.</p>
      <MeerVoorbeelden woord={woord} knoptekst="Ik zie het nog niet voor me" />
      <div className="duw" />
      <button className="knop breed" onClick={klaar} disabled={over > 0}>
        {over > 0 ? `Beeld je het in… ${over}` : "Ik zie het voor me"}
      </button>
    </>
  );
}

export function Luisteren({ woord, klaar, alGezien }: Props) {
  const [kanSpreken, setKanSpreken] = useState(true);
  const [bezig, setBezig] = useState(false);
  const [beluisterd, setBeluisterd] = useState(alGezien);
  const [toonTekst, setToonTekst] = useState(false);

  useEffect(() => {
    setKanSpreken("speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  const luister = (tekst: string) => {
    setBezig(true);
    // Sommige browsers melden nooit dat het voorlezen klaar is; dan gaan we na een ruime schatting toch door.
    const vangnet = setTimeout(() => {
      setBezig(false);
      setBeluisterd(true);
    }, Math.min(20000, 2000 + tekst.length * 80));
    spreek(tekst, () => {
      clearTimeout(vangnet);
      setBezig(false);
      setBeluisterd(true);
    });
  };

  if (!kanSpreken) {
    return (
      <>
        <p className="zacht klein">Je browser kan geen tekst voorlezen. Daarom zie je hier de tekst.</p>
        <Lezen woord={woord} klaar={klaar} alGezien={alGezien} />
      </>
    );
  }

  return (
    <>
      {toonTekst ? (
        <>
          <Kop woord={woord} />
          <p className="definitie">{woord.definitie}</p>
          <Voorbeeld woord={woord} />
          <MeerVoorbeelden woord={woord} knoptekst="Meer voorbeelden" />
        </>
      ) : (
        <div className="kaart" style={{ alignItems: "center", textAlign: "center", padding: "28px 18px" }}>
          <p className="serif" style={{ fontSize: 22 }}>
            Luister goed
          </p>
          <p className="zacht klein">
            Het woord, de betekenis en een voorbeeld worden voorgelezen. De tekst blijft eerst verborgen.
          </p>
          <button
            className="knop"
            onClick={() => luister(`${woord.woord}. ${woord.definitie} Bijvoorbeeld: ${woord.voorbeeldzin}`)}
            disabled={bezig}
          >
            <IcoonLuister />
            {bezig ? "Aan het voorlezen…" : beluisterd ? "Nog een keer" : "Luister"}
          </button>
          {beluisterd && (woord.voorbeelden ?? []).length > 0 && (
            <button
              className="linkknop"
              onClick={() => luister(`Nog meer voorbeelden. ${(woord.voorbeelden ?? []).join(" ")}`)}
              disabled={bezig}
            >
              Luister naar meer voorbeelden
            </button>
          )}
          {beluisterd && (
            <button className="linkknop" onClick={() => setToonTekst(true)}>
              Toon tekst
            </button>
          )}
        </div>
      )}
      <div className="duw" />
      <button className="knop breed" onClick={klaar} disabled={!beluisterd}>
        Volgende
      </button>
    </>
  );
}

/** Zinsbeginnetjes die passen bij het soort woord, zodat je niet met een leeg vel begint. */
function zinsstarters(woord: Woord): string[] {
  const w = woord.woord;
  const soort = woord.woordsoort.toLowerCase();
  if (soort.startsWith("werkwoord")) {
    return [`Het is lastig om … te ${w}, omdat …`, `Op mijn werk moeten we soms … ${w}, bijvoorbeeld als …`];
  }
  if (soort.startsWith("bijvoeglijk")) {
    return [`Ik vond … behoorlijk ${w}, omdat …`, `Iets wat ik ${w} zou noemen, is …`];
  }
  if (soort.startsWith("bijwoord")) {
    return [`Ik weet ${w} dat …, want …`];
  }
  return [`Een goed voorbeeld van ${w} vind ik …`, `Ik moest aan ${w} denken toen …`, `In het nieuws kom je ${w} tegen bij …`];
}

// Zelf een zin maken is de actiefste manier van leren. Je vergelijkt je zin daarna zelf met het voorbeeld.
export function Doen({ woord, klaar, alGezien }: Props) {
  const [zin, setZin] = useState("");
  const [vergelijk, setVergelijk] = useState(alGezien);
  const [hulp, setHulp] = useState(0);
  const inspiratie = (woord.voorbeelden ?? [])[0];

  return (
    <>
      <Kop woord={woord} />
      <p className="definitie">{woord.definitie}</p>
      <label className="sectie" style={{ gap: 6 }}>
        <span className="tekst-2 klein">Maak zelf een zin met dit woord, het liefst over iets uit je eigen leven.</span>
        <textarea rows={3} value={zin} onChange={(e) => setZin(e.target.value)} maxLength={500} />
      </label>

      {hulp > 0 && !vergelijk && (
        <div className="kaart hulp" style={{ gap: 8 }}>
          <span className="label">Zo zou je kunnen beginnen</span>
          <ul>
            {zinsstarters(woord).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="tekst-2 klein">Denk aan iets uit je werk, het nieuws of je eigen leven.</p>
          {hulp > 1 && inspiratie && (
            <>
              <span className="label" style={{ marginTop: 6 }}>
                Ter inspiratie
              </span>
              <p className="citaat">“{inspiratie}”</p>
            </>
          )}
        </div>
      )}
      {!vergelijk && hulp < 2 && (
        <button className="linkknop" onClick={() => setHulp((h) => h + 1)}>
          {hulp === 0 ? "Hulp nodig?" : "Nog meer hulp: laat een voorbeeld zien"}
        </button>
      )}

      {vergelijk && (
        <div className="kaart" style={{ gap: 6 }}>
          <span className="label">Voorbeeld</span>
          <Voorbeeld woord={woord} />
          <p className="zacht klein">Gebruik je het woord in dezelfde betekenis? Zo niet, pas je zin gerust nog aan.</p>
        </div>
      )}
      <div className="duw" />
      {vergelijk ? (
        <button className="knop breed" onClick={klaar}>
          Volgende
        </button>
      ) : (
        <button className="knop breed" onClick={() => setVergelijk(true)} disabled={zin.trim().length === 0}>
          Vergelijk met het voorbeeld
        </button>
      )}
    </>
  );
}
