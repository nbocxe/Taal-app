// Alleen op de server gebruiken: hier staat de API-sleutel.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

export const MODEL = "claude-opus-5";

let client: Anthropic | null = null;
function getClient() {
  client ??= new Anthropic();
  return client;
}

export class AiFout extends Error {}

/**
 * Stuurt een vraag naar Claude en dwingt een antwoord af in het opgegeven formaat.
 * Als Claude een verzoek weigert, probeert de API het automatisch met een ander model (fallbacks).
 */
export async function vraagGestructureerd<T extends z.ZodType>(opties: {
  systeem: string;
  vraag: string;
  schema: T;
  inspanning: "low" | "medium" | "high";
}): Promise<z.infer<T>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AiFout(
      "Er is geen ANTHROPIC_API_KEY ingesteld. Zet je sleutel in het bestand .env.local en start de app opnieuw.",
    );
  }

  try {
    const antwoord = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: opties.systeem,
      messages: [{ role: "user", content: opties.vraag }],
      output_config: {
        effort: opties.inspanning,
        format: betaZodOutputFormat(opties.schema),
      },
    });

    if (antwoord.stop_reason === "refusal") {
      throw new AiFout("De AI wilde dit verzoek niet uitvoeren. Probeer een ander onderwerp.");
    }
    if (antwoord.parsed_output == null) {
      throw new AiFout("De AI gaf een onverwacht antwoord. Probeer het nog eens.");
    }
    return antwoord.parsed_output;
  } catch (fout) {
    if (fout instanceof AiFout) throw fout;
    if (fout instanceof Anthropic.AuthenticationError) {
      throw new AiFout("De API-sleutel wordt niet geaccepteerd. Controleer ANTHROPIC_API_KEY in .env.local.");
    }
    if (fout instanceof Anthropic.RateLimitError) {
      throw new AiFout("Even te veel verzoeken tegelijk. Wacht een minuutje en probeer het opnieuw.");
    }
    if (fout instanceof Anthropic.APIConnectionError) {
      throw new AiFout("Kan de AI niet bereiken. Controleer je internetverbinding.");
    }
    if (fout instanceof Anthropic.APIError) {
      throw new AiFout(`De AI-dienst gaf een fout (${fout.status ?? "onbekend"}). Probeer het later opnieuw.`);
    }
    throw fout;
  }
}
