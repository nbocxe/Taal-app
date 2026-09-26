import type { MethodeId, Profiel } from "./types.ts";

export interface Methode {
  id: MethodeId;
  naam: string;
  korteUitleg: string;
}

// De vier manieren waarop je een nieuw woord kunt leren. Ze zijn losjes geïnspireerd
// op VARK, maar we labelen je niet: we meten welke vorm jij na een paar dagen nog weet.
export const METHODES: Record<MethodeId, Methode> = {
  lezen: {
    id: "lezen",
    naam: "Lezen",
    korteUitleg: "Definitie, voorbeeldzin en herkomst rustig doorlezen.",
  },
  beeld: {
    id: "beeld",
    naam: "Beeld",
    korteUitleg: "Een beeldende ezelsbrug die je je even voor de geest haalt.",
  },
  luisteren: {
    id: "luisteren",
    naam: "Luisteren",
    korteUitleg: "Het woord, de uitleg en een voorbeeld worden voorgelezen.",
  },
  doen: {
    id: "doen",
    naam: "Doen",
    korteUitleg: "Zelf een zin maken met het woord en die vergelijken met een voorbeeld.",
  },
};

export const METHODE_IDS = Object.keys(METHODES) as MethodeId[];

/** De methodes waarmee je leert: je eigen keuze, of alle vier als je niets (of "ik weet het niet") koos. */
export function gekozenMethodes(profiel: Profiel | null): MethodeId[] {
  return profiel && profiel.methodes.length > 0 ? profiel.methodes : METHODE_IDS;
}
