// Spellingcontrole voor de dicteestap: je hoort een woord en typt het zelf.

export type Uitslag = "goed" | "hoofdletters" | "fout";

/** Spaties aan de randen en dubbele spaties tellen niet mee; al het andere wel. */
function schoon(tekst: string): string {
  return tekst.normalize("NFC").trim().replace(/\s+/g, " ");
}

/**
 * Vergelijk wat je typte met de juiste schrijfwijze.
 * Accenten, streepjes en spaties moeten kloppen; alleen een verschil in hoofdletters rekenen we goed,
 * met een opmerking erbij.
 */
export function controleer(invoer: string, juist: string): Uitslag {
  const a = schoon(invoer);
  const b = schoon(juist);
  if (a === b) return "goed";
  if (a.toLowerCase() === b.toLowerCase()) return "hoofdletters";
  return "fout";
}

export interface Stukje {
  tekst: string;
  /** true als dit deel van het juiste woord ontbrak of anders was in wat je typte. */
  anders: boolean;
}

/**
 * Deelt het juiste woord op in stukjes die je goed had en stukjes die ontbraken of anders waren,
 * op basis van de langste gemeenschappelijke deelreeks (zonder op hoofdletters te letten).
 */
export function verschil(invoer: string, juist: string): Stukje[] {
  const a = [...schoon(invoer).toLowerCase()];
  const bOrigineel = [...schoon(juist)];
  const b = bOrigineel.map((t) => t.toLowerCase());

  // Tabel met de lengte van de langste gemeenschappelijke deelreeks vanaf elke positie.
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const gevonden = new Array(b.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      gevonden[j] = true;
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  const stukjes: Stukje[] = [];
  bOrigineel.forEach((teken, k) => {
    const anders = !gevonden[k];
    const laatste = stukjes[stukjes.length - 1];
    if (laatste && laatste.anders === anders) laatste.tekst += teken;
    else stukjes.push({ tekst: teken, anders });
  });
  return stukjes;
}
