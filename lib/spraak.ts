"use client";

/** Leest tekst voor in het Nederlands. `klaar` wordt aangeroepen als het voorlezen stopt. */
export function spreek(tekst: string, klaar: () => void, tempo = 0.95) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const uiting = new SpeechSynthesisUtterance(tekst);
  uiting.lang = "nl-NL";
  uiting.rate = tempo;
  const stem = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("nl"));
  if (stem) uiting.voice = stem;
  uiting.onend = klaar;
  uiting.onerror = klaar;
  synth.speak(uiting);
}

export function kanVoorlezen(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
