import type { NextConfig } from "next";

// De app bestaat alleen uit losse bestanden (geen server nodig), zodat hij gratis op GitHub Pages kan.
// Op GitHub Pages staat hij in een submap, bijvoorbeeld /Taal-app; die geeft de publicatiestap mee.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
