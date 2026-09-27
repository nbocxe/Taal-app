// Gedeelde datatypes. Alles wordt (voorlopig) lokaal in de browser opgeslagen.

export type MethodeId = "lezen" | "beeld" | "luisteren" | "doen";

export type Niveau = "basis" | "gevorderd" | "expert";

/** Een woord uit de woordenbank, aangevuld met een id en vakgebied. */
export interface Woord {
  id: string;
  domein: string;
  niveau: Niveau;
  woord: string;
  woordsoort: string;
  definitie: string;
  voorbeeldzin: string;
  /** Extra voorbeeldzinnen, voor als je meer context nodig hebt. */
  voorbeelden: string[];
  herkomst: string;
  /** Een beeldende ezelsbrug: een scène die je voor je ziet. */
  beeld: string;
}

export interface Herhaling {
  /** Tijdstip (ms) van deze herhaling. */
  op: number;
  goed: boolean;
  /** Hoeveel ms er zat tussen deze herhaling en het vorige contact met het woord. */
  sindsVorige: number;
}

/** Leerkaart: houdt bij hoe en wanneer je een woord leerde en herhaalde. */
export interface Kaart {
  woordId: string;
  methode: MethodeId;
  geleerdOp: number;
  /** Leitner-bak: 0 = net geleerd/fout, hoger = beter gekend. */
  bak: number;
  /** Tijdstip (ms) waarop het woord weer herhaald moet worden. */
  volgende: number;
  herhalingen: Herhaling[];
  /** Uitslag van de spellingoefening bij het leren, als die aan stond. */
  spelling?: "goed" | "fout";
}

export interface Profiel {
  domeinen: string[];
  niveau: Niveau;
  /** De leermethodes die je wilt gebruiken. Leeg betekent "ik weet het niet": alle methodes wisselen elkaar af. */
  methodes: MethodeId[];
}

export interface Instellingen {
  /** Elk nieuw woord begint met een dictee: luisteren en zelf schrijven. */
  spellingoefening: boolean;
}

/** Een hoofdstuk in een leerpad: een handvol woorden die bij elkaar horen, met een eigen leestekst. */
export interface Hoofdstuk {
  titel: string;
  inleiding: string;
  /** Verwijzingen naar woorden uit de woordenbank van het vakgebied van het pad, in leervolgorde. */
  woorden: string[];
  /**
   * Een eigen tekst waarin de woorden samen voorkomen. Alinea's scheid je met een lege regel.
   * Een woord markeer je met [[woord]], of met [[zwarte gaten|zwart gat]] als de tekst een vervoeging gebruikt.
   */
  leestekst: string;
}

/** Een leerpad: woorden leren in de context van een bekende bron, zoals een boek. */
export interface LeerPad {
  id: string;
  domein: string;
  titel: string;
  auteur: string;
  jaar: number;
  inleiding: string;
  /** Een extra waarschuwing, bijvoorbeeld bij medische onderwerpen. */
  disclaimer?: string;
  hoofdstukken: Hoofdstuk[];
}

/** Wat je in een leerpad gedaan hebt. Welke woorden je kent, volgt al uit je woordenlijst. */
export interface PadVoortgang {
  /** Beste toetsscore per hoofdstuk (aantal goed). */
  toets: Record<number, number>;
}

export interface AppData {
  versie: 1;
  profiel: Profiel | null;
  woorden: Record<string, Woord>;
  kaarten: Record<string, Kaart>;
  instellingen: Instellingen;
  paden: Record<string, PadVoortgang>;
  /** Testmodus: verschuift de klok zodat je herhalingen kunt uitproberen zonder te wachten. */
  klokVerschuiving: number;
}
