/** Pin positions in @svg-maps/thailand viewBox (0 0 560 1025). */
export const thailandMapPins = [
  {
    slug: "chiang-rai",
    x: 174,
    y: 52,
    provinceId: "cri",
    cardOffsetX: 72,
    cardOffsetY: 18,
  },
  {
    slug: "chiang-mai",
    x: 98,
    y: 125,
    provinceId: "cmi",
    cardOffsetX: -78,
    cardOffsetY: 8,
  },
  {
    slug: "khao-kho",
    x: 261,
    y: 299,
    provinceId: "pnb",
    cardOffsetX: 78,
    cardOffsetY: 0,
  },
  {
    slug: "khao-yai",
    x: 321,
    y: 387,
    provinceId: "nma",
    cardOffsetX: 82,
    cardOffsetY: -10,
  },
  {
    slug: "kanchanaburi",
    x: 114,
    y: 406,
    provinceId: "kri",
    cardOffsetX: -80,
    cardOffsetY: 0,
  },
  {
    slug: "bangkok",
    x: 222,
    y: 473,
    provinceId: "bkk",
    cardOffsetX: -74,
    cardOffsetY: -12,
  },
  {
    slug: "pattaya",
    x: 265,
    y: 516,
    provinceId: "cbi",
    cardOffsetX: 80,
    cardOffsetY: 14,
  },
  {
    slug: "hua-hin",
    x: 151,
    y: 605,
    provinceId: "pkn",
    cardOffsetX: -78,
    cardOffsetY: 0,
  },
  {
    slug: "phuket",
    x: 68,
    y: 865,
    provinceId: "pkt",
    cardOffsetX: -24,
    cardOffsetY: -72,
  },
  {
    slug: "krabi",
    x: 113,
    y: 859,
    provinceId: "kbi",
    cardOffsetX: 118,
    cardOffsetY: -6,
  },
  {
    slug: "hatyai",
    x: 219,
    y: 923,
    provinceId: "ska",
    cardOffsetX: 84,
    cardOffsetY: -18,
  },
  {
    slug: "betong",
    x: 262,
    y: 988,
    provinceId: "yla",
    cardOffsetX: 82,
    cardOffsetY: 28,
  },
] as const;

export type ThailandMapPin = (typeof thailandMapPins)[number];

export const THAILAND_MAP_VIEWBOX = { width: 560, height: 1025 } as const;

/** Extra horizontal padding on mobile so pin cards don't push the map off-center. */
export const THAILAND_MAP_MOBILE_FRAME = {
  minX: -40,
  minY: -8,
  width: 640,
  height: 1040,
} as const;

export type MapFrame = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export function toMapFrameViewBox(frame: MapFrame) {
  return `${frame.minX} ${frame.minY} ${frame.width} ${frame.height}`;
}

export function toMapPercent(
  x: number,
  y: number,
  frame: MapFrame,
): { left: string; top: string } {
  return {
    left: `${((x - frame.minX) / frame.width) * 100}%`,
    top: `${((y - frame.minY) / frame.height) * 100}%`,
  };
}
