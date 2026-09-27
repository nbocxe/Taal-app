# Taal-app

Een app om je woordenschat per vakgebied te vergroten en om te ontdekken **hoe jij het beste leert**.

De woordenlijst bevat 275 woorden in twaalf vakgebieden: algemene kennis, taal & retorica, filosofie, politiek,
politieke stromingen, maatschappij, economie, recht, psychologie, biologie, natuurkunde en tech.

Deze eerste versie werkt zonder AI: de woorden komen uit een ingebouwde woordenlijst. Er is geen account, geen
API-sleutel en geen internetverbinding met een externe dienst nodig.

## Het idee

Je hoeft geen leerstijltest te doen. De app voert een klein persoonlijk experiment uit:

1. Je kiest een vakgebied, of een mix van al je vakgebieden, en een niveau. De app pakt 5 nieuwe woorden uit de
   woordenlijst, elk met uitleg, voorbeeldzinnen, herkomst en een beeldende ezelsbrug.
2. Je kiest zelf met welke leermethodes je wilt leren; je krijgt alleen die te zien. Weet je het niet, dan wisselen
   alle vier elkaar af:
   - **Lezen**: definitie, voorbeeldzin en herkomst doorlezen.
   - **Beeld**: een beeldende ezelsbrug die je je even voor de geest haalt.
   - **Luisteren**: het woord en de uitleg worden voorgelezen door je apparaat.
   - **Doen**: zelf een zin maken en die vergelijken met een voorbeeld.
3. Een dag later krijg je een korte meerkeuze-overhoring. Voor elk woord dezelfde test, zodat de methodes eerlijk
   vergeleken worden. De foute antwoorden zijn betekenissen van andere woorden uit hetzelfde vakgebied, van ongeveer
   dezelfde lengte. Zo kun je het goede antwoord niet raden door gewoon het langste te kiezen.
4. In het **profiel** zie je per gekozen methode hoeveel je nog wist. Heb je meer dan één methode gekozen, dan krijg
   je na genoeg metingen vaker woorden via de methode die bij jou het beste werkt. De andere komen af en toe terug,
   voor het geval dat verandert.

**Spellingoefening (optioneel):** zet je in *Profiel → Instellingen* de spellingoefening aan, dan begint elk nieuw
woord met een dictee. Je hoort het woord, typt het zelf, en de app laat zien of het goed is en welke letters anders
moesten. Daarna volgt de gewone leermethode. De oefening geldt voor alle methodes gelijk, dus het experiment blijft eerlijk.

**Leerpaden:** onder *Leren* staan leerpaden bij bekende bronnen: *Een korte geschiedenis van de tijd* van Stephen
Hawking (natuurkunde) en de DSM-5 (psychologie). Een pad heeft vier hoofdstukken met elk zes woorden. Per hoofdstuk
leer je de woorden in de volgorde van het verhaal, lees je een korte tekst waarin ze samen voorkomen (tik op een woord
voor de betekenis) en doe je een toets. De toets is extra oefening en telt niet mee in het experiment. De teksten zijn
zelf geschreven; er staat geen tekst uit de boeken in.

Woorden die je kent komen steeds later terug (1, 3, 7, 16, 35 en 90 dagen). Dit heet *spaced repetition*.

## Waarom geen VARK-test?

Het idee dat je "een visueel type" bent en dan beter leert met plaatjes (de *meshing-hypothese*) blijkt in onderzoek
niet op te gaan. Mensen hebben wel voorkeuren, maar die voorspellen slecht wat je echt onthoudt. Daarom
meet deze app het gewoon bij jou. Aan het begin vraagt de app ook wat je zelf denkt; later zie je of dat klopte.

## De app starten (stap voor stap)

Je hebt [Node.js](https://nodejs.org) versie 22 of nieuwer nodig (kies de "LTS"-versie).

Open daarna een terminal in deze map en typ:

```bash
npm install   # eenmalig: installeert de benodigde onderdelen
npm run dev   # start de app
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

**Tip:** Wil je de herhalingen meteen uitproberen? Ga naar *Mijn leerprofiel → Testmodus* en klik op "Spring 1 dag
vooruit".

## Woorden toevoegen

Elk vakgebied heeft een eigen bestand in `lib/woorden/`, bijvoorbeeld `lib/woorden/economie.ts`. Voor een nieuw woord
kopieer je een bestaand blok in dat bestand en pas je de tekst aan. Foute antwoorden hoef je niet te bedenken: die haalt
de app zelf uit de andere woorden van het vakgebied.

Een tip voor de definitie: gebruik het woord zelf er niet in, anders verklap je het antwoord.

Een nieuw vakgebied maak je door een nieuw bestand in `lib/woorden/` te zetten en het toe te voegen bovenin
`lib/woordenbank.ts`. Het verschijnt dan vanzelf in de app.

Een nieuw leerpad maak je door een bestand in `lib/paden/` te zetten (kopieer `hawking.ts`) en het toe te voegen in
`lib/leerpaden.ts`. De woorden van het pad moeten in de woordenlijst van het vakgebied staan. In de leestekst markeer
je een woord met `[[woord]]`, of met `[[zwarte gaten|zwart gat]]` als de tekst een andere vorm gebruikt.

Draai daarna `npm test`: die controleert onder meer of elk woord compleet is en of er geen dubbele woorden in staan.

## Ontwerp

Richting "Woordenboek": warm papierkleurig, een klassieke schreefletter (Newsreader) voor de woorden en koppen, een
rustige schreefloze letter (Source Sans 3) voor de rest, en één terracotta accentkleur. Staat je telefoon in donkere
modus, dan kleurt de app mee naar een warme donkere variant. Elk vakgebied heeft een eigen lijntekening. De
lettertypes zitten in de app zelf, dus er gaat geen verkeer naar Google.

## Online zetten

De app bestaat uit losse bestanden en draait gratis op GitHub Pages. Bij elke wijziging op de `main`-branch bouwt
GitHub de app opnieuw en zet hem online (zie `.github/workflows/pages.yml`). Eenmalig moet je in de repository bij
*Settings → Pages* onder *Build and deployment* de bron op **GitHub Actions** zetten.

## Hoe het in elkaar zit

| Map/bestand | Wat het doet |
|---|---|
| `app/` | De schermen: Vandaag, Leren, Herhalen, Profiel en Kennismaken |
| `app/components/` | Gedeelde onderdelen: tabbalk, tekeningen per vakgebied, iconen |
| `app/leren/methodes.tsx` | De vier leermethodes |
| `app/leren/Dictee.tsx` en `lib/spelling.ts` | De spellingoefening en de spellingcontrole |
| `app/globals.css` | Kleuren, lettertypes en de vormgeving van alle onderdelen |
| `lib/woorden/` | De woorden, één bestand per vakgebied |
| `lib/woordenbank.ts` | Welke nieuwe woorden je krijgt en welke foute antwoorden in de overhoring staan |
| `app/paden/` en `lib/leerpaden.ts` | De leerpaden: padpagina, leestekst en toets |
| `lib/paden/` | De inhoud van de leerpaden, één bestand per bron |
| `lib/srs.ts` | Het herhaalschema |
| `lib/experiment.ts` | Welke methode krijgt een woord, en welke werkt voor jou het best |
| `lib/opslag.ts` | Bewaart alles in je browser (nog geen accounts) |

Andere commando's:

```bash
npm test            # test de woordenlijst, het herhaalschema en het experiment
npm run typecheck   # controleert de code op typefouten
npm run build       # maakt de online versie in de map out/
```

## Bekende beperkingen van deze versie

- Om echt te weten welke methode bij jou past, zijn per methode minstens 8 gemeten woorden nodig: 32 in totaal.
- Je gegevens staan alleen in de browser waarin je leert. Maak af en toe een back-up via het leerprofiel.
- Voorlezen gebruikt de stem van je apparaat of browser; de kwaliteit verschilt per apparaat.
- De overhoring is altijd meerkeuze op basis van tekst. Dat is eerlijk voor alle methodes, maar niet perfect.
