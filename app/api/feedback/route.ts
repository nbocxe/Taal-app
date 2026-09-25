import { z } from "zod";
import { AiFout, vraagGestructureerd } from "@/lib/claude";

const Verzoek = z.object({
  woord: z.string().max(80),
  definitie: z.string().max(500),
  zin: z.string().trim().min(1).max(500),
});

const Antwoord = z.object({
  juistGebruikt: z.boolean().describe("Of het woord in de zin inhoudelijk juist gebruikt wordt."),
  feedback: z.string().describe("Korte, vriendelijke feedback van 1-3 zinnen, aangesproken met 'je'."),
  verbeterdeZin: z
    .string()
    .describe("Een verbeterde versie van de zin als dat nodig is, anders een lege string."),
});

const SYSTEEM = `Je bent een vriendelijke docent Nederlands. Een volwassen leerling heeft net een nieuw woord geleerd en probeert het zelf in een zin te gebruiken.
Beoordeel vooral of het woord in de juiste betekenis gebruikt wordt. Kleine taalfoutjes elders in de zin mag je kort noemen, maar reken ze niet zwaar.
Geef concrete, bemoedigende feedback. Leg bij onjuist gebruik uit wat er niet klopt.`;

export async function POST(request: Request) {
  const invoer = Verzoek.safeParse(await request.json().catch(() => null));
  if (!invoer.success) {
    return Response.json({ fout: "Ongeldig verzoek." }, { status: 400 });
  }
  const { woord, definitie, zin } = invoer.data;

  try {
    const oordeel = await vraagGestructureerd({
      systeem: SYSTEEM,
      vraag: `Woord: ${woord}\nBetekenis: ${definitie}\nZin van de leerling: ${zin}`,
      schema: Antwoord,
      inspanning: "low",
    });
    return Response.json(oordeel);
  } catch (fout) {
    if (fout instanceof AiFout) return Response.json({ fout: fout.message }, { status: 502 });
    console.error(fout);
    return Response.json({ fout: "Er ging iets mis bij het beoordelen van je zin." }, { status: 500 });
  }
}
