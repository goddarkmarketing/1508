import type { TransferRate } from "@/types";

export const transferRates: TransferRate[] = [
  {
    vehicle: "Van",
    seats: "9 seats",
    items: [
      { description: "Airport – hotel or hotel – airport", rateThb: 1500 },
      { description: "Bangkok one day (8–10 hrs)", rateThb: 4000 },
      { description: "Outside Bangkok one day (8–10 hrs)", rateThb: 4500 },
    ],
    notes: [
      "Guide fee: THB 2,000 per day",
      "Tipping for guide & driver: THB 100 per person / day",
    ],
  },
  {
    vehicle: "Coach",
    seats: "35–45 seats",
    items: [
      { description: "Airport – hotel or hotel – airport", rateThb: 9000 },
      { description: "Bangkok one day (8–10 hrs)", rateThb: 12000 },
      { description: "Outside Bangkok one day (8–10 hrs)", rateThb: 13000 },
    ],
    notes: [
      "Guide fee: THB 2,500 per day",
      "Tipping for guide & driver: THB 100 per person / day",
    ],
  },
];

export const fleet = {
  vans: [
    "Toyota Commuter 9 Seat VIP",
    "Toyota Commuter 8 Seat VIP",
    "Toyota Alphard",
  ],
  coaches: [
    "Deluxe class 30 seat",
    "Deluxe class 37 seat",
    "Deluxe class 44 seat",
    "VIP 31 seat",
    "VIP 45 seat",
  ],
};

export const dayTrips = [
  {
    slug: "coral-island-speedboat",
    title: "Coral Island (Koh Larn) by Speed Boat",
    location: "Pattaya",
    summary:
      "Tropical escape to Coral Island with clear water, white sand, and optional water sports — about 20–45 minutes from Pattaya.",
    timing: [
      "08:30 Pick up from hotel",
      "09:30 Depart by speed boat",
      "10:00 Arrive Coral Island & activities",
      "12:30 Lunch at island restaurant (optional)",
      "15:30 Return to Pattaya",
      "16:30 Back to hotel",
    ],
    activities: [
      "Parasailing",
      "Jet Ski",
      "Banana Boat",
      "Snorkeling / Glass-bottom boat",
      "Sea Walker",
    ],
    note: "Water sport activities are own expense (pay on spot or pre-select).",
  },
];

export const servicePillars = [
  {
    title: "Private & SIC tours",
    description:
      "Ready-made packages across Bangkok, North, and Andaman destinations — private programs and join tours for agents.",
  },
  {
    title: "Transfers by van & coach",
    description:
      "Airport transfers and full-day charters with VIP vans and deluxe/VIP coaches.",
  },
  {
    title: "Muslim-friendly programs",
    description:
      "Halal meal arrangements and Friday prayer support on selected Bangkok and Northern itineraries.",
  },
  {
    title: "Groups & MICE",
    description:
      "Incentive, team building, student groups, senior groups, golf packages, and company trips.",
  },
];
