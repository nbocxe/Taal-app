import type { LeerPad } from "../types.ts";

// De teksten hieronder zijn zelf geschreven en geven in gewone taal weer waar de DSM-5 over gaat; er staat geen tekst
// uit de handleiding in.
export const dsm5: LeerPad = {
  id: "dsm5",
  domein: "Psychologie",
  titel: "DSM-5",
  auteur: "American Psychiatric Association",
  jaar: 2013,
  inleiding:
    "De DSM-5 is het handboek dat psychologen en psychiaters wereldwijd gebruiken om psychische stoornissen te beschrijven. Je komt de termen eruit tegen in het nieuws, in series en in gesprekken met hulpverleners. Dit leerpad leert je die woorden kennen: eerst hoe het systeem werkt, daarna de bekendste groepen stoornissen.",
  disclaimer:
    "Dit leerpad is bedoeld om de taal te leren, niet om jezelf of anderen een diagnose te geven. Herken je iets bij jezelf en maak je je zorgen? Praat erover met je huisarts.",
  hoofdstukken: [
    {
      titel: "Het classificatiesysteem",
      inleiding: "Hoe de DSM werkt, en welke woorden hulpverleners gebruiken als ze over een diagnose praten.",
      woorden: ["classificatie", "criterium", "prevalentie", "comorbiditeit", "differentiaaldiagnose", "etiologie"],
      leestekst: `De DSM is in de kern een [[classificatie]]: een indeling van psychische stoornissen in groepen, zodat hulpverleners dezelfde taal spreken. Een onderzoeker in Groningen en een psychiater in Chicago bedoelen met dezelfde naam zo hetzelfde.

Per stoornis staat er een lijst met [[criteria|criterium]]. Iemand krijgt een diagnose pas als er genoeg criteria kloppen, al een bepaalde tijd, en als de klachten het dagelijks leven echt verstoren. Eén slechte week is dus geen depressie.

Het handboek noemt ook de [[prevalentie]]: hoe vaak een stoornis voorkomt. En het waarschuwt voor [[comorbiditeit]]: veel mensen hebben meer dan één aandoening tegelijk, zoals angst en somberheid.

Omdat klachten op elkaar kunnen lijken, maakt een behandelaar een [[differentiaaldiagnose]]: welke verklaringen zijn er nog meer mogelijk? Opvallend is wat de DSM níét doet: over de [[etiologie]], de oorzaken, zegt het handboek bewust weinig. Het beschrijft wat je ziet, niet waarom het ontstaat.`,
    },
    {
      titel: "Stemming en angst",
      inleiding: "De stoornissen die het vaakst voorkomen: somberheid, stemmingswisselingen en angst.",
      woorden: ["depressieve stoornis", "bipolaire stoornis", "gegeneraliseerde angststoornis", "paniekstoornis", "fobie", "dwangstoornis"],
      leestekst: `Een [[depressieve stoornis]] is meer dan verdriet. Iemand is minstens twee weken bijna elke dag somber of heeft nergens meer zin in, vaak samen met moeheid, slecht slapen en schuldgevoelens.

Bij een [[bipolaire stoornis]] wisselen sombere perioden af met perioden van manie: een opgejaagde, overdreven opgewekte stemming waarin iemand weinig slaap nodig lijkt te hebben en grote risico's neemt.

Angst is een gezonde reactie op gevaar, maar kan ook doorslaan. Bij een [[gegeneraliseerde angststoornis]] piekert iemand maandenlang over van alles. Bij een [[paniekstoornis]] komen er plotselinge aanvallen van hevige angst, met hartkloppingen en benauwdheid. Een [[fobie]] is juist heel gericht: angst voor spinnen, hoogte of vliegen, die zo sterk is dat iemand die dingen gaat vermijden.

De [[dwangstoornis]] staat sinds de DSM-5 in een eigen hoofdstuk. Iemand heeft steeds terugkerende, ongewenste gedachten en voelt zich gedwongen handelingen te herhalen, zoals controleren of wassen, om de onrust te dempen.`,
    },
    {
      titel: "Ontwikkeling en persoonlijkheid",
      inleiding: "Stoornissen die al vroeg in het leven beginnen, en blijvende patronen in hoe iemand in het leven staat.",
      woorden: ["ADHD", "autismespectrumstoornis", "neurodiversiteit", "persoonlijkheidsstoornis", "borderline", "narcisme"],
      leestekst: `Sommige stoornissen horen bij de ontwikkeling en beginnen al in de kindertijd. Bij [[ADHD]] gaat het om blijvende problemen met aandacht, vaak samen met impulsiviteit en onrust. Bij een [[autismespectrumstoornis]] draait het om verschillen in sociaal contact en communicatie, en om een sterke behoefte aan vaste patronen. Het woord spectrum geeft aan dat het er bij iedereen anders uitziet.

Steeds meer mensen spreken liever van [[neurodiversiteit]]: het idee dat hersenen verschillend werken en dat dat niet alleen een tekort is, maar ook een vorm van natuurlijke variatie.

Een [[persoonlijkheidsstoornis]] is een patroon van denken, voelen en omgaan met anderen dat al jaren star en in veel situaties terugkomt, en dat tot lijden leidt. Een bekende vorm is [[borderline]], met heftige, snel wisselende emoties en een wankel zelfbeeld.

Ook [[narcisme]] komt als persoonlijkheidsstoornis in het handboek voor: een patroon van grootheidsgevoelens, behoefte aan bewondering en weinig inlevingsvermogen. In het dagelijks leven wordt het woord veel losser gebruikt dan psychologen het bedoelen.`,
    },
    {
      titel: "Psychose en trauma",
      inleiding: "Wat er gebeurt als het contact met de werkelijkheid wankelt, en hoe ingrijpende gebeurtenissen doorwerken.",
      woorden: ["psychose", "hallucinatie", "waan", "schizofrenie", "PTSS", "dissociatie"],
      leestekst: `Bij een [[psychose]] raakt iemand tijdelijk het contact met de werkelijkheid kwijt. Twee kenmerken springen eruit. Een [[hallucinatie]] is een waarneming zonder prikkel van buiten, zoals stemmen horen. Een [[waan]] is een vaste overtuiging die niet klopt, bijvoorbeeld dat je achtervolgd wordt, en die niet verdwijnt door tegenbewijs.

Een psychose kan eenmalig zijn, bijvoorbeeld door drugs of zware stress. Bij [[schizofrenie]] keren psychosen terug en komen er vaak andere klachten bij, zoals minder motivatie en vlakkere emoties. Anders dan veel mensen denken, heeft het niets met een 'gespleten persoonlijkheid' te maken.

Na een schokkende gebeurtenis, zoals een ongeluk of geweld, kan [[PTSS]] ontstaan: de gebeurtenis komt steeds terug in herinneringen en nachtmerries, iemand vermijdt alles wat eraan doet denken en blijft voortdurend op zijn hoede.

Soms zet de geest zichzelf als het ware op afstand. Bij [[dissociatie]] voelt iemand zich los van zijn gedachten, gevoel of lichaam, alsof hij naar zichzelf kijkt. In lichte vorm kent iedereen het; bij trauma kan het een manier zijn om het onverdraaglijke te overleven.`,
    },
  ],
};
