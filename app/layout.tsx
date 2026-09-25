import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taal-app",
  description: "Vergroot je woordenschat per vakgebied en ontdek hoe jij het beste leert.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <header className="kop">
          <Link href="/">Taal-app</Link>
          <nav>
            <Link href="/leren">Leren</Link>
            <Link href="/herhalen">Herhalen</Link>
            <Link href="/profiel">Mijn leerprofiel</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
