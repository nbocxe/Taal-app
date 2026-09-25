import { z } from "zod";
import { AiFout, vraagGestructureerd } from "@/lib/claude";

const Verzoek = z.object({
  domein: z.string().trim().min(1).max(80),
  niveau: z.enum(["basis", "gevorderd", "expert"]),
  aantal: z.number().int().min(1).max(10),
  bekend: z.array(z.string().max(80)).max(2000),
});

const WoordSchema = z.object({
  woord: z.string().describe("Het woord of begrip zelf, zoals het in een woordenboek staat."),
  woordsoort: z.string().describe("Bijv. zelfstandig naamwoord, werkwoord, bijvoeglijk naamwoord."),
  definitie: z.string().describe("Heldere definitie van één of twee zinnen, zonder het woord zelf te gebruiken."),
  voorbeeldzin: z.string().describe("Een natuurlijke zin waarin het woord correct gebruikt wordt, zoals in een krant of vakboek."),
  herkomst: z.string().describe("Korte herkomst of woordopbouw (bijv. Grieks/Latijn) die helpt het te onthouden."),
  beeld: z.string().describe("Een beeldende ezelsbrug: een levendige, concrete scène van 1-2 zinnen die de betekenis vangt."),
  emoji: z.string().describe("Eén tot drie emoji die het beeld ondersteunen."),
  afleiders: z
    .array(z.string())
    .describe("Precies drie foute maar plausibele definities in dezelfde stijl en lengte als de echte definitie."),
});

const Antwoord = z.object({ woorden: z.array(WoordSchema) });

const NIVEAUS = {
  basis: "woorden die een geïnteresseerde leek in de krant of een populair-wetenschappelijk artikel tegenkomt",
  gevorderd: "woorden uit kwaliteitskranten, opiniestukken en inleidende studieboeken",
  expert: "vaktermen die professionals en vakliteratuur gebruiken",
};

const SYSTEEM = `Je bent een ervaren docent Nederlands die volwassenen met Nederlands als moedertaal helpt hun woordenschat in vakgebieden te vergroten.
Je kiest woorden die echt nuttig zijn om te kennen: ze komen voor in nieuws, vakliteratuur of gesprekken over het onderwerp, en een ontwikkelde volwassene kent ze niet vanzelfsprekend.
Alles is in correct, helder Nederlands. Definities zijn inhoudelijk juist; wees zorgvuldig met feiten.
De foute definities (afleiders) moeten geloofwaardig zijn voor iemand die het woord niet kent, maar duidelijk fout voor wie het wel kent.`;

export async function POST(request: Request) {
  const invoer = Verzoek.safeParse(await request.json().catch(() => null));
  if (!invoer.success) {
    return Response.json({ fout: "Ongeldig verzoek." }, { status: 400 });
  }
  const { domein, niveau, aantal, bekend } = invoer.data;

  const vraag = `Vakgebied: ${domein}
Niveau: ${niveau} (${NIVEAUS[niveau]})
Geef precies ${aantal} nieuwe woorden.
${bekend.length > 0 ? `Deze woorden kent de gebruiker al, gebruik ze niet:\n${bekend.join(", ")}` : ""}`;

  try {
    const { woorden } = await vraagGestructureerd({
      systeem: SYSTEEM,
      vraag,
      schema: Antwoord,
      inspanning: "medium",
    });
    const bekendeSet = new Set(bekend.map((w) => w.toLowerCase()));
    const nieuw = woorden
      .filter((w) => !bekendeSet.has(w.woord.toLowerCase()) && w.afleiders.length >= 3)
      .map((w) => ({ ...w, afleiders: w.afleiders.slice(0, 3) }));
    return Response.json({ woorden: nieuw });
  } catch (fout) {
    if (fout instanceof AiFout) return Response.json({ fout: fout.message }, { status: 502 });
    console.error(fout);
    return Response.json({ fout: "Er ging iets mis bij het ophalen van woorden." }, { status: 500 });
  }
}
