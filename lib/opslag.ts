"use client";

// Voorlopig bewaren we alles in de browser (localStorage). Accounts en een database kunnen later.
import { useCallback, useEffect, useState } from "react";
import type { AppData } from "./types";

const SLEUTEL = "taalapp:v1";

function leeg(): AppData {
  return { versie: 1, profiel: null, woorden: {}, kaarten: {}, klokVerschuiving: 0 };
}

function laad(): AppData {
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    return ruw ? { ...leeg(), ...JSON.parse(ruw) } : leeg();
  } catch {
    return leeg();
  }
}

function bewaar(data: AppData) {
  try {
    localStorage.setItem(SLEUTEL, JSON.stringify(data));
  } catch {
    // Opslag vol of geblokkeerd; de app blijft werken tot je de pagina sluit.
  }
}

/** Geeft de opgeslagen gegevens (null tijdens het laden) en een functie om ze aan te passen. */
export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(laad());
  }, []);

  const wijzig = useCallback((aanpassing: (huidig: AppData) => AppData) => {
    setData((huidig) => {
      const nieuw = aanpassing(huidig ?? laad());
      bewaar(nieuw);
      return nieuw;
    });
  }, []);

  return [data, wijzig] as const;
}

/** De huidige tijd, rekening houdend met de testmodus. */
export function nu(data: AppData): number {
  return Date.now() + data.klokVerschuiving;
}

export function nieuwId(): string {
  return crypto.randomUUID();
}

export function exporteer(data: AppData): string {
  return JSON.stringify(data, null, 2);
}
