"use client";

import Link from "next/link";
import { analyseer } from "@/lib/experiment";
import { METHODES } from "@/lib/methodes";
import { nu, useAppData } from "@/lib/opslag";
import { teHerhalen } from "@/lib/srs";

export default function Home() {
  const [data] = useAppData();
  if (!data) return null;

  if (!data.profiel) {
    return (
      <div className="kaart">
        <h1>Welkom!</h1>
        <p>
          Met deze app leer je nieuwe woorden in vakgebieden die jou interesseren. Je leert elk woord op een
          van vier manieren: lezen, beeld, luisteren of doen. Een dag later kijkt de app wat je nog weet.
        </p>
        <p>
          Zo ontdek je aan de hand van je eigen resultaten welke manier voor jou het beste werkt. Je hoeft
          dus geen leerstijltest te doen.
        </p>
        <Link className="knop" href="/start">
          Aan de slag
        </Link>
      </div>
    );
  }

  const kaarten = Object.values(data.kaarten);
  const teDoen = teHerhalen(kaarten, nu(data)).length;
  const analyse = analyseer(kaarten);

  return (
    <>
      <div className="kaart">
        <p className="label">Vandaag</p>
        {teDoen > 0 ? (
          <p>
            Je hebt <strong>{teDoen}</strong> {teDoen === 1 ? "woord" : "woorden"} om te herhalen.
          </p>
        ) : (
          <p>Er staat niets te herhalen. Tijd voor nieuwe woorden?</p>
        )}
        <div className="rij">
          {teDoen > 0 && (
            <Link className="knop" href="/herhalen">
              Herhalen
            </Link>
          )}
          <Link className={teDoen > 0 ? "knop tweede" : "knop"} href="/leren">
            Nieuwe woorden leren
          </Link>
        </div>
      </div>

      <div className="kaart">
        <p className="label">Jouw experiment</p>
        {analyse.beste ? (
          <p>
            Tot nu toe onthoud je woorden het best via <strong>{METHODES[analyse.beste].naam}</strong>. De
            app geeft je daarom vaker woorden op die manier.
          </p>
        ) : (
          <p>
            De app is nog aan het uitzoeken hoe jij het beste leert. Hoe meer je leert én herhaalt, hoe
            sneller dat duidelijk wordt.
          </p>
        )}
        <div className="balk" aria-label="Voortgang experiment">
          <div style={{ width: `${Math.round(analyse.voortgang * 100)}%` }} />
        </div>
        <p className="zacht">
          {kaarten.length} woorden geleerd · <Link href="/profiel">Bekijk je leerprofiel</Link>
        </p>
      </div>
    </>
  );
}
