import { PADEN } from "@/lib/leerpaden";
import { PadScherm } from "./PadScherm";

// De padpagina's worden vooraf gebouwd, zodat ze ook op GitHub Pages (zonder server) werken.
export const dynamicParams = false;

export function generateStaticParams() {
  return PADEN.map((pad) => ({ id: pad.id }));
}

export default async function Pad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PadScherm id={id} />;
}
