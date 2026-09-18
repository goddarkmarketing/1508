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
    cardOffsetX: -74,
    cardOffsetY: 22,
  },
  {
    slug: "mae-hong-son",
    x: 44,
    y: 124,
    provinceId: "msn",
    cardOffsetX: -58,
    cardOffsetY: -42,
  },
  {
    slug: "phrae",
    x: 177,
    y: 156,
    provinceId: "pre",
    cardOffsetX: 76,
    cardOffsetY: -22,
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
    slug: "ayutthaya",
    x: 215,
    y: 427,
    provinceId: "aya",
    cardOffsetX: 78,
    cardOffsetY: -24,
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
    slug: "rayong",
    x: 274,
    y: 532,
    provinceId: "ryg",
    cardOffsetX: -78,
    cardOffsetY: 28,
  },
  {
    slug: "koh-chang",
    x: 353,
    y: 580,
    provinceId: "trt",
    cardOffsetX: 72,
    cardOffsetY: 18,
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

/** Map zones for province fills — North / East / West / South (ฟ้าอ่อนเข้าธีม GGM). */
export type MapZone = "north" | "east" | "west" | "south";

export const mapZoneMeta: Record<
  MapZone,
  { labelTh: string; labelEn: string; fill: string; hover: string; stroke: string }
> = {
  north: {
    labelTh: "เหนือ",
    labelEn: "North",
    fill: "#d7ebf8",
    hover: "#b9daf2",
    stroke: "#7eb6d9",
  },
  east: {
    labelTh: "ออก",
    labelEn: "East",
    fill: "#c4e0f5",
    hover: "#9ec9ea",
    stroke: "#6aa3d1",
  },
  west: {
    labelTh: "ตก",
    labelEn: "West",
    fill: "#e4f1fa",
    hover: "#c8dff2",
    stroke: "#8bb4d6",
  },
  south: {
    labelTh: "ใต้",
    labelEn: "South",
    fill: "#b6d6ef",
    hover: "#8fc0e4",
    stroke: "#5a98c7",
  },
};

/** Province id → zone (Central grouped with West / ตก). */
const NORTH_IDS = new Set([
  "cmi",
  "lpn",
  "lpg",
  "utd",
  "pre",
  "nan",
  "pyo",
  "cri",
  "msn",
  "nsn",
  "uti",
  "kpt",
  "tak",
  "sti",
  "plk",
  "pct",
  "pnb",
]);

const EAST_IDS = new Set([
  "cbi",
  "ryg",
  "cti",
  "trt",
  "cco",
  "pri",
  "nyk",
  "skw",
  "nma",
  "brm",
  "srn",
  "ssk",
  "ubn",
  "yst",
  "cpm",
  "acr",
  "bkn",
  "nbp",
  "kkn",
  "udn",
  "lei",
  "nki",
  "mkm",
  "ret",
  "ksn",
  "snk",
  "npm",
  "mdh",
]);

const SOUTH_IDS = new Set([
  "nrt",
  "kbi",
  "pna",
  "pkt",
  "sni",
  "rng",
  "cpn",
  "ska",
  "stn",
  "trg",
  "plg",
  "ptn",
  "yla",
  "nwt",
  "lksg",
]);

export function getProvinceZone(provinceId: string): MapZone {
  if (NORTH_IDS.has(provinceId)) return "north";
  if (EAST_IDS.has(provinceId)) return "east";
  if (SOUTH_IDS.has(provinceId)) return "south";
  return "west";
}

export const THAILAND_MAP_VIEWBOX = { width: 560, height: 1025 } as const;

export type MapFrame = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

const LAND_BOUNDS = {
  minX: 0,
  minY: 0,
  maxX: THAILAND_MAP_VIEWBOX.width as number,
  maxY: THAILAND_MAP_VIEWBOX.height as number,
};

type FramePin = {
  x: number;
  y: number;
  cardOffsetX: number;
  cardOffsetY: number;
};

/** Fit all pins + label cards inside the map frame for the current container width. */
export function computeMapFrame(
  pins: readonly FramePin[],
  containerWidthPx: number,
  compact: boolean,
): MapFrame {
  const cardWidthPx = compact ? 84 : 120;
  const cardHeightPx = compact ? 28 : 36;
  const widthScale = Math.max(0.82, Math.min(1.12, containerWidthPx / 360));

  let minX = LAND_BOUNDS.minX;
  let minY = LAND_BOUNDS.minY;
  let maxX = LAND_BOUNDS.maxX;
  let maxY = LAND_BOUNDS.maxY;

  for (const pin of pins) {
    const cardX = pin.x + pin.cardOffsetX;
    const cardY = pin.y + pin.cardOffsetY;
    minX = Math.min(minX, pin.x, cardX);
    maxX = Math.max(maxX, pin.x, cardX);
    minY = Math.min(minY, pin.y, cardY);
    maxY = Math.max(maxY, pin.y, cardY);
  }

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const padX = ((cardWidthPx / 2) * widthScale * contentWidth) / containerWidthPx + 20;
  const padY = ((cardHeightPx / 2) * widthScale * contentWidth) / containerWidthPx + 24;

  return {
    minX: Math.floor(minX - padX),
    minY: Math.floor(minY - padY),
    width: Math.ceil(contentWidth + padX * 2),
    height: Math.ceil(contentHeight + padY * 2),
  };
}

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
