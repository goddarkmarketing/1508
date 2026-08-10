export type FleetVehicle = {
  slug: string;
  name: string;
  category: "van" | "coach";
  seats: string;
  bestFor: string;
  highlights: string[];
  image?: string;
  gallery?: string[];
  sourceUrl?: string;
};

/** Van photos sourced from Toyota Motor Thailand (studio / white background). */
export const fleetVehicles: FleetVehicle[] = [
  {
    slug: "toyota-commuter-9",
    name: "Toyota Commuter 9 Seat VIP",
    category: "van",
    seats: "9 seats",
    bestFor: "Airport transfers, private city tours, small FIT groups",
    highlights: [
      "VIP seating layout for guest comfort",
      "Ideal for hotel–airport runs",
      "Suitable for half-day and full-day charters",
    ],
    image: "/fleet/commuter-white.webp",
    gallery: [
      "/fleet/commuter-white.webp",
      "/fleet/commuter-alt-white.webp",
      "/fleet/hiace-3-white.webp",
    ],
    sourceUrl: "https://www.toyota.co.th/en/model/commuter",
  },
  {
    slug: "toyota-commuter-8",
    name: "Toyota Commuter 8 Seat VIP",
    category: "van",
    seats: "8 seats",
    bestFor: "Premium private transfers and family groups",
    highlights: [
      "More space per guest than standard layouts",
      "Comfortable for long-distance day trips",
      "Popular for agent FIT arrangements",
    ],
    image: "/fleet/commuter-alt-white.webp",
    gallery: [
      "/fleet/commuter-alt-white.webp",
      "/fleet/commuter-white.webp",
      "/fleet/hiace-white.webp",
    ],
    sourceUrl: "https://www.toyota.co.th/en/model/commuter",
  },
  {
    slug: "toyota-alphard",
    name: "Toyota Alphard",
    category: "van",
    seats: "6–7 seats",
    bestFor: "VIP guests, executives, honeymoon and luxury transfers",
    highlights: [
      "Premium MPV experience",
      "Executive lounge comfort for key clients",
      "Ideal for high-end private programs",
    ],
    image: "/fleet/alphard-white.webp",
    gallery: [
      "/fleet/alphard-white.webp",
      "/fleet/alphard-alt-white.webp",
      "/fleet/alphard-3-white.webp",
    ],
    sourceUrl: "https://www.toyota.co.th/en/model/alphard",
  },
  {
    slug: "toyota-hiace",
    name: "Toyota Hiace",
    category: "van",
    seats: "Up to 12–15 seats",
    bestFor: "Larger FIT groups and flexible charter use",
    highlights: [
      "Spacious commercial van platform",
      "Practical for group luggage and day tours",
      "Strong option when VIP Commuter capacity is exceeded",
    ],
    image: "/fleet/hiace-white.webp",
    gallery: [
      "/fleet/hiace-white.webp",
      "/fleet/hiace-alt-white.webp",
      "/fleet/hiace-3-white.webp",
    ],
    sourceUrl: "https://www.toyota.co.th/en/model/hiace",
  },
  {
    slug: "coach-deluxe-30",
    name: "Deluxe Coach 30 Seat",
    category: "coach",
    seats: "30 seats",
    bestFor: "Series groups, school groups, mid-size incentive",
    highlights: [
      "Coach seating for organized group movement",
      "Suitable for Bangkok and upcountry programs",
      "Paired with guide service on request",
    ],
  },
  {
    slug: "coach-deluxe-37",
    name: "Deluxe Coach 37 Seat",
    category: "coach",
    seats: "37 seats",
    bestFor: "Incentive groups and company trips",
    highlights: [
      "Balanced capacity for mid-to-large groups",
      "Full-day charter ready",
      "Airport arrival / departure handling",
    ],
  },
  {
    slug: "coach-deluxe-44",
    name: "Deluxe Coach 44 Seat",
    category: "coach",
    seats: "44 seats",
    bestFor: "Large series groups and MICE movements",
    highlights: [
      "High passenger capacity",
      "Efficient for hotel–attraction transfers",
      "Available with guide fee options",
    ],
  },
  {
    slug: "coach-vip-31",
    name: "VIP Coach 31 Seat",
    category: "coach",
    seats: "31 seats",
    bestFor: "Premium group travel with higher comfort",
    highlights: [
      "VIP coach class for special groups",
      "Better comfort for long-distance routes",
      "Suitable for incentive and senior groups",
    ],
  },
  {
    slug: "coach-vip-45",
    name: "VIP Coach 45 Seat",
    category: "coach",
    seats: "45 seats",
    bestFor: "Large VIP / incentive movements",
    highlights: [
      "Maximum VIP coach capacity in fleet list",
      "Supports large arrival groups",
      "Quote based on date and routing",
    ],
  },
];

export function getFleetByCategory(category: FleetVehicle["category"]) {
  return fleetVehicles.filter((v) => v.category === category);
}
