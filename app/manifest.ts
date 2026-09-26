import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basis = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Zorgt dat je de app op je telefoon op het beginscherm kunt zetten.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taal-app",
    short_name: "Taal-app",
    description: "Vergroot je woordenschat per vakgebied.",
    start_url: `${basis}/`,
    icons: [{ src: `${basis}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
    display: "standalone",
    background_color: "#f6f1e7",
    theme_color: "#f6f1e7",
    lang: "nl",
  };
}
