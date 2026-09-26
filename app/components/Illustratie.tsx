// Eén lijntekening per vakgebied, in de stijl van de app: inktlijnen met zachte, warme vlakken.
// De kleuren komen uit de CSS-variabelen, zodat de tekeningen ook in de donkere modus kloppen.

import type { ReactNode } from "react";

const KLEI = "var(--tint-klei)";
const SALIE = "var(--tint-salie)";
const ZAND = "var(--tint-zand)";
const PAPIER = "var(--vlak)";
const INKT = "var(--inkt)";

const TEKENINGEN: Record<string, ReactNode> = {
  "Algemene kennis": (
    <>
      <circle cx="100" cy="54" r="34" fill={SALIE} />
      <ellipse cx="100" cy="54" rx="14" ry="34" fill="none" />
      <path d="M66 54h68M70 39h60M70 69h60" />
      <path d="M58 76a44 44 0 0 0 84 0" fill="none" />
      <path d="M100 98v8M80 108h40" />
    </>
  ),
  "Taal & retorica": (
    <>
      <rect x="36" y="20" width="84" height="48" rx="14" fill={KLEI} />
      <path d="M56 68l-8 16 22-16" fill={KLEI} />
      <path d="M52 37h52M52 50h34" />
      <rect x="96" y="48" width="72" height="42" rx="14" fill={SALIE} />
      <path d="M146 90l8 14-22-14" fill={SALIE} />
      <path d="M110 64h44M110 76h26" />
    </>
  ),
  Filosofie: (
    <>
      <path d="M52 104h96" />
      <ellipse cx="100" cy="64" rx="32" ry="38" fill={ZAND} />
      <path d="M74 36l4-16 12 12M126 36l-4-16-12 12" fill={ZAND} />
      <circle cx="87" cy="56" r="12" fill={PAPIER} />
      <circle cx="113" cy="56" r="12" fill={PAPIER} />
      <circle cx="87" cy="56" r="4" fill={INKT} stroke="none" />
      <circle cx="113" cy="56" r="4" fill={INKT} stroke="none" />
      <path d="M96 68l4 8 4-8z" fill={KLEI} />
      <path d="M90 101v3M110 101v3" />
    </>
  ),
  Politiek: (
    <>
      <path d="M50 48l50-28 50 28z" fill={KLEI} />
      <path d="M50 48h100v9H50z" fill={PAPIER} />
      <path d="M62 57v38M81 57v38M100 57v38M119 57v38M138 57v38" />
      <rect x="44" y="95" width="112" height="10" rx="2" fill={ZAND} />
    </>
  ),
  "Politieke stromingen": (
    <>
      <path d="M36 106h128" />
      <path d="M58 106V30M100 106V20M142 106V36" />
      <path d="M58 30q12-7 24 0t24 0v18q-12 7-24 0t-24 0z" fill={KLEI} />
      <path d="M100 20q12-7 24 0t24 0v18q-12 7-24 0t-24 0z" fill={SALIE} />
      <path d="M142 36q10-6 20 0v16q-10 6-20 0z" fill={ZAND} />
    </>
  ),
  Maatschappij: (
    <>
      <circle cx="68" cy="50" r="11" fill={ZAND} />
      <circle cx="132" cy="50" r="11" fill={ZAND} />
      <path d="M48 98a20 22 0 0 1 40 0z" fill={SALIE} />
      <path d="M112 98a20 22 0 0 1 40 0z" fill={SALIE} />
      <circle cx="100" cy="40" r="13" fill={KLEI} />
      <path d="M74 102a26 30 0 0 1 52 0z" fill={KLEI} />
    </>
  ),
  Economie: (
    <>
      <path d="M40 18v86h124" />
      <rect x="56" y="70" width="18" height="34" fill={ZAND} />
      <rect x="84" y="56" width="18" height="48" fill={SALIE} />
      <rect x="112" y="40" width="18" height="64" fill={KLEI} />
      <path d="M52 60l28-18 24 8 44-28" fill="none" />
      <path d="M136 22h12v12" fill="none" />
    </>
  ),
  Recht: (
    <>
      <path d="M100 24v76M82 106q18-12 36 0z" fill={ZAND} />
      <circle cx="100" cy="22" r="5" fill={PAPIER} />
      <path d="M54 34h92" />
      <path d="M54 34l-13 32M54 34l13 32M146 34l-13 32M146 34l13 32" />
      <path d="M38 66q16 16 32 0z" fill={KLEI} />
      <path d="M130 66q16 16 32 0z" fill={SALIE} />
    </>
  ),
  Psychologie: (
    <>
      <path
        d="M72 106V88Q56 82 58 60Q60 24 98 22Q134 20 140 52l7 14q2 5-4 5h-5v13q0 8-10 8h-14v14"
        fill={ZAND}
      />
      <path d="M100 58a4 4 0 1 1 8 0a9 9 0 1 1-18 0a14 14 0 1 1 28 0" fill="none" stroke={"var(--accent)"} />
    </>
  ),
  Biologie: (
    <>
      <path d="M52 94Q54 30 144 24Q142 92 52 94z" fill={SALIE} />
      <path d="M52 94Q92 64 134 32" fill="none" />
      <path d="M78 76l-3-18M94 64l0-18M110 52l4-15M82 74l20 4M98 62l22 2M114 50l18-2" />
      <path d="M52 94l-10 12" />
    </>
  ),
  Natuurkunde: (
    <>
      <ellipse cx="100" cy="60" rx="52" ry="18" fill="none" />
      <ellipse cx="100" cy="60" rx="52" ry="18" fill="none" transform="rotate(60 100 60)" />
      <ellipse cx="100" cy="60" rx="52" ry="18" fill="none" transform="rotate(120 100 60)" />
      <circle cx="100" cy="60" r="9" fill={KLEI} />
      <circle cx="152" cy="60" r="5" fill={SALIE} />
      <circle cx="74" cy="15" r="5" fill={SALIE} />
      <circle cx="74" cy="105" r="5" fill={SALIE} />
    </>
  ),
  Tech: (
    <>
      <path d="M80 30V18M93 30V18M107 30V18M120 30V18M80 102V90M93 102V90M107 102V90M120 102V90" />
      <path d="M70 40H58M70 53H58M70 67H58M70 80H58M130 40h12M130 53h12M130 67h12M130 80h12" />
      <rect x="70" y="30" width="60" height="60" rx="6" fill={ZAND} />
      <rect x="85" y="45" width="30" height="30" rx="3" fill={KLEI} />
    </>
  ),
};

/** Tekening bij een vakgebied. Onbekende vakgebieden krijgen een open boek. */
export function Illustratie({ domein }: { domein: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      stroke={INKT}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TEKENINGEN[domein] ?? (
        <>
          <path d="M100 32q-24-12-52-8v70q28-4 52 8q24-12 52-8V24q-28-4-52 8z" fill={ZAND} />
          <path d="M100 32v70" />
        </>
      )}
    </svg>
  );
}
