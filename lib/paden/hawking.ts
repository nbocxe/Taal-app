import type { LeerPad } from "../types.ts";

// De teksten hieronder zijn zelf geschreven en volgen de onderwerpen van het boek; er staat geen tekst uit het boek in.
export const hawking: LeerPad = {
  id: "hawking",
  domein: "Natuurkunde",
  titel: "Een korte geschiedenis van de tijd",
  auteur: "Stephen Hawking",
  jaar: 1988,
  inleiding:
    "In dit boek legt natuurkundige Stephen Hawking uit hoe het heelal is ontstaan, wat zwarte gaten zijn en waarom de tijd maar één kant op lijkt te gaan. Het werd een wereldwijde bestseller, maar het zit vol vaktaal. Dit leerpad leert je die woorden in de volgorde waarin ze in het verhaal nodig zijn, zodat het boek (of een documentaire erover) beter te volgen is.",
  hoofdstukken: [
    {
      titel: "Ruimte en tijd",
      inleiding: "Hoe Einstein ons beeld van ruimte, tijd en zwaartekracht op zijn kop zette.",
      woorden: ["zwaartekracht", "lichtsnelheid", "relativiteitstheorie", "ruimtetijd", "tijddilatatie", "lichtkegel"],
      leestekst: `Newton zag [[zwaartekracht]] als een kracht die op afstand werkt: de aarde trekt aan de appel, de zon aan de aarde. Tijd was voor hem overal hetzelfde, een klok die voor iedereen even snel tikt.

Begin twintigste eeuw bleek er iets vreemds aan de hand met licht. De [[lichtsnelheid]] is voor elke waarnemer precies gelijk, of je nu stilstaat of er met een raket achteraan vliegt. Einstein nam dat serieus en kwam met de [[relativiteitstheorie]]: als de snelheid van licht vastligt, moeten ruimte en tijd meegeven.

Zo ontstond het idee van de [[ruimtetijd]], één geheel van ruimte en tijd. Zware voorwerpen krommen die ruimtetijd, en wat wij [[zwaartekracht]] noemen, is het volgen van die kromming. Een gevolg is [[tijddilatatie]]: dicht bij een zware massa of bij hoge snelheid tikt een klok langzamer.

Hawking gebruikt graag een tekening om dit te laten zien: de [[lichtkegel]]. Vanuit elke gebeurtenis spreidt licht zich uit. Alles binnen die kegel kan de gebeurtenis beïnvloeden; alles erbuiten ligt te ver weg, want niets gaat sneller dan licht.`,
    },
    {
      titel: "Het uitdijende heelal",
      inleiding: "Hoe sterrenkundigen ontdekten dat het heelal groeit, en wat dat zegt over het begin.",
      woorden: ["sterrenstelsel", "roodverschuiving", "uitdijing", "oerknal", "kosmische achtergrondstraling", "singulariteit"],
      leestekst: `Lang dachten mensen dat het heelal altijd al zo was geweest. In de jaren twintig keek Edwin Hubble met een grote telescoop naar vage vlekjes aan de hemel en zag dat elk vlekje een eigen [[sterrenstelsel]] was, vol miljarden sterren.

Het licht van die stelsels vertoonde [[roodverschuiving]]: het was naar het rode deel van het spectrum geschoven. Dat betekent dat ze van ons af bewegen, en hoe verder weg, hoe sneller. De enige logische verklaring is de [[uitdijing]] van het heelal zelf.

Draai je die film terug, dan zat alles vroeger dichter op elkaar. Uiteindelijk kom je uit bij de [[oerknal]], het hete, dichte begin. In 1965 vingen twee onderzoekers per ongeluk een zwakke ruis op die uit alle richtingen kwam: de [[kosmische achtergrondstraling]], het nagloeien van dat begin.

Hawking en Roger Penrose bewezen dat de relativiteitstheorie dan voorspelt dat het heelal begon in een [[singulariteit]], een punt waar de natuurwetten ophouden te werken. Later zou Hawking zich afvragen of dat begin met de kwantumtheorie misschien anders te beschrijven is.`,
    },
    {
      titel: "Zwarte gaten",
      inleiding: "Wat er gebeurt als een ster sterft, en waarom zwarte gaten toch niet helemaal zwart zijn.",
      woorden: ["supernova", "witte dwerg", "neutronenster", "zwart gat", "waarnemingshorizon", "hawkingstraling"],
      leestekst: `Een ster leeft zolang ze brandstof heeft. Een ster zoals de zon blaast aan het eind haar buitenlagen weg en krimpt tot een [[witte dwerg]]: klein, heet en langzaam afkoelend.

Een veel zwaardere ster eindigt spectaculairder. Haar kern stort in en de rest ontploft in een [[supernova]]. Wat overblijft is vaak een [[neutronenster]], zo dicht dat een theelepel ervan miljarden kilo's weegt.

Is de kern nog zwaarder, dan houdt niets de ineenstorting tegen en ontstaat een [[zwart gat]]. De grens eromheen heet de [[waarnemingshorizon]]: wat daar overheen gaat, zelfs licht, komt nooit meer terug.

Hawkings beroemdste ontdekking was dat [[zwarte gaten|zwart gat]] toch een beetje stralen. Door kwantumeffecten vlak bij de horizon lekt er heel langzaam energie weg. Die [[hawkingstraling]] betekent dat een zwart gat na onvoorstelbaar lange tijd kan verdampen.`,
    },
    {
      titel: "Kwantum en de pijl van de tijd",
      inleiding: "De wereld van het allerkleinste, en de zoektocht naar één theorie voor alles.",
      woorden: ["kwantummechanica", "onzekerheidsprincipe", "virtuele deeltjes", "antimaterie", "entropie", "theorie van alles"],
      leestekst: `Voor het allerkleinste werkt de relativiteitstheorie niet goed. Daar heb je de [[kwantummechanica]] nodig, waarin je uitkomsten alleen als kansen kunt voorspellen.

Een kernidee is het [[onzekerheidsprincipe]] van Heisenberg: hoe preciezer je weet waar een deeltje is, hoe minder je weet over zijn snelheid. Daardoor is zelfs lege ruimte nooit helemaal leeg. Er ontstaan voortdurend [[virtuele deeltjes]]: paren van een deeltje en een tegendeeltje die even opduiken en elkaar weer opheffen. Zo'n tegendeeltje hoort bij de [[antimaterie]]. Precies deze paren gebruikte Hawking om uit te leggen waarom zwarte gaten stralen.

Waarom onthouden we het verleden en niet de toekomst? Hawking verbindt de richting van de tijd met [[entropie]], de wanorde die in een gesloten systeem altijd toeneemt. Een gevallen kopje valt nooit vanzelf weer heel.

Het boek eindigt met een droom: een [[theorie van alles]] die de kwantummechanica en de zwaartekracht verenigt. Als we die vinden, schreef Hawking, zouden we misschien begrijpen waarom het heelal bestaat.`,
    },
  ],
};
