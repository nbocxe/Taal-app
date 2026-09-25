"use client";

// De vier manieren om een nieuw woord te leren. Elke component roept `klaar` aan als je verder wilt.
import { useEffect, useState } from "react";
import type { Woord } from "@/lib/types";

interface Props {
  woord: Woord;
  klaar: () => void;
}

function Kop({ woord }: { woord: Woord }) {
  return (
    <>
      <p className="groot">{woord.woord}</p>
      <p className="zacht">{woord.woordsoort}</p>
    </>
  );
}

export function Lezen({ woord, klaar }: Props) {
  return (
    <>
      <Kop woord={woord} />
      <p>{woord.definitie}</p>
      <p>
        <em>“{woord.voorbeeldzin}”</em>
      </p>
      <p className="zacht">Herkomst: {woord.herkomst}</p>
      <button onClick={klaar}>Gelezen, volgende</button>
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
      <p style={{ fontSize: "4rem", margin: 0 }} aria-hidden>
        {woord.emoji}
      </p>
      <Kop woord={woord} />
      <p>{woord.definitie}</p>
      <div className="kaart">
        <p className="label">Stel je voor</p>
        <p>{woord.beeld}</p>
      </div>
      <p className="zacht">Sluit even je ogen en zie deze scène zo levendig mogelijk voor je.</p>
      <button onClick={klaar} disabled={over > 0}>
        {over > 0 ? `Beeld je het in… ${over}` : "Ik zie het voor me, volgende"}
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
        <p className="fout">Je browser kan geen tekst voorlezen. Daarom zie je hier de tekst.</p>
        <Lezen woord={woord} klaar={klaar} />
      </>
    );
  }

  return (
    <>
      <p className="zacht">Luister goed. De tekst blijft eerst verborgen.</p>
      <div className="rij">
        <button onClick={luister} disabled={bezig}>
          {bezig ? "Aan het voorlezen…" : beluisterd ? "Nog een keer luisteren" : "▶ Luister"}
        </button>
        {beluisterd && !toonTekst && (
          <button className="tweede" onClick={() => setToonTekst(true)}>
            Toon tekst
          </button>
        )}
      </div>
      {toonTekst && (
        <>
          <Kop woord={woord} />
          <p>{woord.definitie}</p>
          <p>
            <em>“{woord.voorbeeldzin}”</em>
          </p>
        </>
      )}
      <button onClick={klaar} disabled={!beluisterd}>
        Volgende
      </button>
    </>
  );
}

interface Oordeel {
  juistGebruikt: boolean;
  feedback: string;
  verbeterdeZin: string;
}

export function Doen({ woord, klaar }: Props) {
  const [zin, setZin] = useState("");
  const [bezig, setBezig] = useState(false);
  const [oordeel, setOordeel] = useState<Oordeel | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  const controleer = async () => {
    setBezig(true);
    setFout(null);
    try {
      const antwoord = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ woord: woord.woord, definitie: woord.definitie, zin }),
      });
      const json = await antwoord.json();
      if (!antwoord.ok) throw new Error(json.fout ?? "Er ging iets mis.");
      setOordeel(json);
    } catch (e) {
      setFout(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBezig(false);
    }
  };

  return (
    <>
      <Kop woord={woord} />
      <p>{woord.definitie}</p>
      <label>
        <span className="zacht">Maak zelf een zin met dit woord, het liefst over iets uit je eigen leven:</span>
        <textarea rows={3} value={zin} onChange={(e) => setZin(e.target.value)} maxLength={500} />
      </label>
      {!oordeel && (
        <div className="rij">
          <button onClick={controleer} disabled={bezig || zin.trim().length === 0}>
            {bezig ? "Even kijken…" : "Controleer mijn zin"}
          </button>
        </div>
      )}
      {fout && (
        <>
          <p className="fout">{fout}</p>
          <button className="tweede" onClick={klaar}>
            Toch verder
          </button>
        </>
      )}
      {oordeel && (
        <div className="kaart">
          <p className={oordeel.juistGebruikt ? "goed" : "fout"}>
            <strong>{oordeel.juistGebruikt ? "Goed gebruikt!" : "Nog niet helemaal"}</strong>
          </p>
          <p>{oordeel.feedback}</p>
          {oordeel.verbeterdeZin && (
            <p>
              <em>Voorstel: “{oordeel.verbeterdeZin}”</em>
            </p>
          )}
          <p className="zacht">Voorbeeld: “{woord.voorbeeldzin}”</p>
          <button onClick={klaar}>Volgende</button>
        </div>
      )}
    </>
  );
}
