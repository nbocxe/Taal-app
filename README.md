# Taal-app

Een app om je woordenschat per vakgebied te vergroten (algemene kennis, politiek, biologie, natuurkunde en tech)
en om te ontdekken **hoe jij het beste leert**.

Deze eerste versie werkt zonder AI: de woorden komen uit een ingebouwde woordenlijst. Er is geen account, geen
API-sleutel en geen internetverbinding met een externe dienst nodig.

## Het idee

Je hoeft geen leerstijltest te doen. De app voert een klein persoonlijk experiment uit:

1. Je kiest een vakgebied en een niveau. De app pakt 5 nieuwe woorden uit de woordenlijst, elk met uitleg,
   voorbeeldzin, herkomst en een beeldende ezelsbrug.
2. Elk woord krijgt één van vier leermethodes:
   - **Lezen**: definitie, voorbeeldzin en herkomst doorlezen.
   - **Beeld**: een beeldende ezelsbrug die je je even voor de geest haalt.
   - **Luisteren**: het woord en de uitleg worden voorgelezen door je apparaat.
   - **Doen**: zelf een zin maken en die vergelijken met een voorbeeld.
3. Een dag later krijg je een korte meerkeuze-overhoring. Voor elk woord dezelfde test, zodat de methodes eerlijk
   vergeleken worden.
4. In **Mijn leerprofiel** zie je per methode hoeveel je nog wist. Zodra er genoeg metingen zijn, krijg je vaker
   woorden via de methode die bij jou het beste werkt. De andere komen af en toe terug, voor het geval dat verandert.

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

Alle woorden staan in `lib/woordenbank.ts`, per vakgebied. Voor een nieuw woord kopieer je een bestaand blok en pas je
de tekst aan. Een nieuw vakgebied voeg je toe als nieuw kopje; het verschijnt dan vanzelf in de app.

Let bij de **afleiders** op: dat zijn de drie foute antwoorden in de overhoring. Ze moeten geloofwaardig klinken voor
iemand die het woord niet kent, en ongeveer even lang zijn als de echte definitie.

Draai daarna `npm test`: die controleert of elk woord compleet is en of er geen dubbele woorden in staan.

## Hoe het in elkaar zit

| Map/bestand | Wat het doet |
|---|---|
| `app/` | De schermen (Next.js): start, kennismaken, leren, herhalen, leerprofiel |
| `app/leren/methodes.tsx` | De vier leermethodes |
| `lib/woordenbank.ts` | Alle woorden, en welke nieuwe woorden je krijgt |
| `lib/srs.ts` | Het herhaalschema |
| `lib/experiment.ts` | Welke methode krijgt een woord, en welke werkt voor jou het best |
| `lib/opslag.ts` | Bewaart alles in je browser (nog geen accounts) |

Andere commando's:

```bash
npm test            # test de woordenlijst, het herhaalschema en het experiment
npm run typecheck   # controleert de code op typefouten
npm run build       # maakt een productieversie
```

## Bekende beperkingen van deze versie

- De woordenlijst heeft 75 woorden (15 per vakgebied). Om echt te weten welke methode bij jou past, zijn per methode
  minstens 8 gemeten woorden nodig. Dat zijn er 32 in totaal, dus de lijst is genoeg om het experiment af te ronden.
- Je gegevens staan alleen in de browser waarin je leert. Maak af en toe een back-up via het leerprofiel.
- Voorlezen gebruikt de stem van je apparaat of browser; de kwaliteit verschilt per apparaat.
- De overhoring is altijd meerkeuze op basis van tekst. Dat is eerlijk voor alle methodes, maar niet perfect.
- Het ontwerp is bewust kaal; dat komt later.
