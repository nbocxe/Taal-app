// Kleine lijniconen. Ze nemen de tekstkleur over (currentColor).

const basis = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IcoonVandaag = () => (
  <svg {...basis}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
export const IcoonLeren = () => (
  <svg {...basis}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20" />
  </svg>
);
export const IcoonHerhalen = () => (
  <svg {...basis}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" />
    <path d="M20 4v5h-5" />
  </svg>
);
export const IcoonProfiel = () => (
  <svg {...basis}>
    <path d="M5 20v-9M12 20V4M19 20v-6" />
  </svg>
);
export const IcoonSluit = () => (
  <svg {...basis} strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IcoonTerug = () => (
  <svg {...basis} strokeWidth={2}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const IcoonPijl = () => (
  <svg {...basis} width={18} height={18} strokeWidth={2}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const IcoonLuister = () => (
  <svg {...basis} width={20} height={20} strokeWidth={2}>
    <path d="M11 5 6 9H3v6h3l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);

/** Icoon per leermethode, voor het labeltje bovenaan de woordkaart. */
export const METHODE_ICONEN = {
  lezen: (
    <svg {...basis} width={16} height={16} strokeWidth={2}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  ),
  beeld: (
    <svg {...basis} width={16} height={16} strokeWidth={2}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5-5-8 8" />
    </svg>
  ),
  luisteren: (
    <svg {...basis} width={16} height={16} strokeWidth={2}>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    </svg>
  ),
  doen: (
    <svg {...basis} width={16} height={16} strokeWidth={2}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  ),
};
