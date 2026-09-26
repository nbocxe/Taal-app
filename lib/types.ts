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
  /** Wat je zelf denkt dat het beste werkt; we vergelijken dit later met je resultaten. */
  voorkeur: MethodeId | "weet-niet";
}

export interface Instellingen {
  /** Elk nieuw woord begint met een dictee: luisteren en zelf schrijven. */
  spellingoefening: boolean;
}

export interface AppData {
  versie: 1;
  profiel: Profiel | null;
  woorden: Record<string, Woord>;
  kaarten: Record<string, Kaart>;
  instellingen: Instellingen;
  /** Testmodus: verschuift de klok zodat je herhalingen kunt uitproberen zonder te wachten. */
  klokVerschuiving: number;
}
