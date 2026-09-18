export type HeroMosaicShot = {
  src: string;
  alt: string;
  script?: string;
  scriptPosition?: "bl" | "tr" | "tl";
  wavy?: boolean;
  aspect43?: boolean;
  /** Tailwind object-position class, e.g. object-[center_70%] */
  objectPosition?: string;
};

/** Right-side hero mosaic — GGM scenic photos, proportions matched to 1506-2. */
export const heroMosaic: HeroMosaicShot[] = [
  {
    src: "/brand/hero/slide-temple.webp",
    alt: "Turquoise bay and limestone cliffs at golden hour",
    aspect43: true,
  },
  {
    src: "/brand/hero/mosaic-krabi.webp",
    alt: "Krabi limestone cliffs and turquoise bay",
    script: "Collect Moments Not Things",
    scriptPosition: "bl",
    objectPosition: "object-[center_70%]",
  },
  {
    src: "/brand/hero/slide-islands.webp",
    alt: "Tropical islands and turquoise sea in southern Thailand",
    script: "Good Trips Brighter Lives",
    scriptPosition: "tr",
    wavy: true,
  },
  {
    src: "/brand/hero/mosaic-bangkok.webp",
    alt: "Bangkok temple rooftops and golden spires",
    script: "A Brighter Tomorrow Somewhere New",
    scriptPosition: "tl",
    objectPosition: "object-[center_62%]",
  },
];

export const heroBadgeAvatars = [
  "/moments/friends-pier.webp",
  "/moments/group-peace.webp",
  "/moments/mice-checkin.webp",
] as const;
