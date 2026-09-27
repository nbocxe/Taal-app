"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { IcoonHerhalen, IcoonLeren, IcoonProfiel, IcoonVandaag } from "./iconen";

const TABS = [
  { href: "/", naam: "Vandaag", icoon: <IcoonVandaag /> },
  { href: "/leren", naam: "Leren", icoon: <IcoonLeren /> },
  { href: "/herhalen", naam: "Herhalen", icoon: <IcoonHerhalen /> },
  { href: "/profiel", naam: "Profiel", icoon: <IcoonProfiel /> },
];

export function TabBalk() {
  const pad = usePathname().replace(/\/$/, "") || "/";
  return (
    <nav className="tabbalk" aria-label="Hoofdmenu">
      <ul>
        {TABS.map((tab) => (
          <li key={tab.href}>
            <Link href={tab.href} aria-current={actief(pad, tab.href) ? "page" : undefined}>
              {tab.icoon}
              {tab.naam}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Leerpaden vallen onder de tab Leren. */
function actief(pad: string, href: string) {
  return pad === href || (href === "/leren" && pad.startsWith("/paden/"));
}

/** Verbergt de tabbalk zolang een leer- of herhaalsessie loopt. */
export function useSessieModus(actief: boolean) {
  useEffect(() => {
    if (!actief) return;
    document.body.dataset.sessie = "1";
    return () => {
      delete document.body.dataset.sessie;
    };
  }, [actief]);
}
