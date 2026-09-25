# Taal-app

Een AI-gedreven app om je woordenschat per vakgebied te vergroten (politiek, biologie, natuurkunde, tech en meer)
en om te ontdekken **hoe jij het beste leert**.

## Het idee

Je hoeft geen leerstijltest te doen. De app voert een klein persoonlijk experiment uit:

1. Je kiest een vakgebied. Claude (de AI van Anthropic) stelt nieuwe woorden samen, met uitleg, voorbeeldzin,
   herkomst en een beeldende ezelsbrug.
2. Elk woord krijgt één van vier leermethodes:
   - **Lezen**: definitie, voorbeeldzin en herkomst doorlezen.
   - **Beeld**: een beeldende ezelsbrug die je je even voor de geest haalt.
   - **Luisteren**: het woord en de uitleg worden voorgelezen.
   - **Doen**: zelf een zin maken, waarna de AI feedback geeft.
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

Je hebt nodig:

- [Node.js](https://nodejs.org) versie 22 of nieuwer (kies de "LTS"-versie).
- Een API-sleutel van Anthropic: maak een account op [console.anthropic.com](https://console.anthropic.com), zet er wat
  tegoed op en maak een sleutel aan bij *Settings → API keys*.

Dan, in een terminal in deze map:

```bash
npm install                 # eenmalig: installeert de benodigde onderdelen
cp .env.example .env.local  # maak je eigen instellingenbestand
```

Open `.env.local` en vervang `sk-ant-...` door je eigen sleutel. Daarna:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

**Tip:** Wil je de herhalingen meteen uitproberen? Ga naar *Mijn leerprofiel → Testmodus* en klik op "Spring 1 dag
vooruit".

**Kosten:** elke ronde van 5 woorden en elke zin die je laat controleren is een aanroep naar de AI. Een ronde
woorden kost ongeveer een paar cent tot een dubbeltje. Je verbruik zie je in de Anthropic Console.

## Hoe het in elkaar zit

| Map/bestand | Wat het doet |
|---|---|
| `app/` | De schermen (Next.js): start, kennismaken, leren, herhalen, leerprofiel |
| `app/leren/methodes.tsx` | De vier leermethodes |
| `app/api/woorden` | Laat Claude nieuwe woorden samenstellen (op de server, zodat je sleutel geheim blijft) |
| `app/api/feedback` | Laat Claude je eigen zin beoordelen |
| `lib/srs.ts` | Het herhaalschema |
| `lib/experiment.ts` | Welke methode krijgt een woord, en welke werkt voor jou het best |
| `lib/opslag.ts` | Bewaart alles in je browser (nog geen accounts) |

Andere commando's:

```bash
npm test            # test het herhaalschema en het experiment
npm run typecheck   # controleert de code op typefouten
npm run build       # maakt een productieversie
```

## Bekende beperkingen van deze eerste versie

- Je gegevens staan alleen in de browser waarin je leert. Maak af en toe een back-up via het leerprofiel.
- Voorlezen gebruikt de stem van je apparaat of browser; de kwaliteit verschilt per apparaat.
- De overhoring is altijd meerkeuze op basis van tekst. Dat is eerlijk voor alle methodes, maar niet perfect.
- Het ontwerp is bewust kaal; dat komt later.
