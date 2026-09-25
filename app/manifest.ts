import type { MetadataRoute } from "next";

// Zorgt dat je de app op je telefoon op het beginscherm kunt zetten.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taal-app",
    short_name: "Taal-app",
    description: "Vergroot je woordenschat per vakgebied.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#2f5bd3",
    lang: "nl",
  };
}
