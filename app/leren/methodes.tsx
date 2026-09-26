"use client";

// De vier manieren om een nieuw woord te leren. Elke component roept `klaar` aan als je verder wilt.
import { useEffect, useState } from "react";
import type { Woord } from "@/lib/types";
import { IcoonLuister } from "../components/iconen";

interface Props {
  woord: Woord;
  klaar: () => void;
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
      <div className="duw" />
      <button className="knop breed" onClick={klaar}>
        Gelezen, volgende
      </button>
    </>
  );
}

const DENKTIJD = 6;

export function Beeld({ woord, klaar }: Props) {
  const [over, setOver] = useState(DENKTIJD);

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
      <div className="duw" />
      <button className="knop breed" onClick={klaar} disabled={over > 0}>
        {over > 0 ? `Beeld je het in… ${over}` : "Ik zie het voor me"}
      </button>
    </>
  );
}

function spreek(tekst: string, klaar: () => void) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const uiting = new SpeechSynthesisUtterance(tekst);
  uiting.lang = "nl-NL";
  uiting.rate = 0.95;
  const stem = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("nl"));
  if (stem) uiting.voice = stem;
  uiting.onend = klaar;
  uiting.onerror = klaar;
  synth.speak(uiting);
}

export function Luisteren({ woord, klaar }: Props) {
  const [kanSpreken, setKanSpreken] = useState(true);
  const [bezig, setBezig] = useState(false);
  const [beluisterd, setBeluisterd] = useState(false);
  const [toonTekst, setToonTekst] = useState(false);

  useEffect(() => {
    setKanSpreken("speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  const luister = () => {
    const tekst = `${woord.woord}. ${woord.definitie} Bijvoorbeeld: ${woord.voorbeeldzin}`;
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
        <Lezen woord={woord} klaar={klaar} />
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
        </>
      ) : (
        <div className="kaart" style={{ alignItems: "center", textAlign: "center", padding: "28px 18px" }}>
          <p className="serif" style={{ fontSize: 22 }}>
            Luister goed
          </p>
          <p className="zacht klein">Het woord, de betekenis en een voorbeeld worden voorgelezen. De tekst blijft eerst verborgen.</p>
          <button className="knop" onClick={luister} disabled={bezig}>
            <IcoonLuister />
            {bezig ? "Aan het voorlezen…" : beluisterd ? "Nog een keer" : "Luister"}
          </button>
          {beluisterd && (
            <button className="knop tweede" onClick={() => setToonTekst(true)}>
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

// Zelf een zin maken is de actiefste manier van leren. Je vergelijkt je zin daarna zelf met het voorbeeld.
export function Doen({ woord, klaar }: Props) {
  const [zin, setZin] = useState("");
  const [vergelijk, setVergelijk] = useState(false);

  return (
    <>
      <Kop woord={woord} />
      <p className="definitie">{woord.definitie}</p>
      <label className="sectie" style={{ gap: 6 }}>
        <span className="tekst-2 klein">Maak zelf een zin met dit woord, het liefst over iets uit je eigen leven.</span>
        <textarea rows={3} value={zin} onChange={(e) => setZin(e.target.value)} maxLength={500} />
      </label>
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
