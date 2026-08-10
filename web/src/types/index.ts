export type MealCode = "B" | "L" | "D" | "Own";

export type TourCategory =
  | "city"
  | "beach"
  | "culture"
  | "nature"
  | "muslim-friendly";

export type TourType = "private" | "sic" | "join";

export interface ItineraryDay {
  day: number;
  title: string;
  meals: string;
  activities: string[];
  /** Optional place photo for this day */
  image?: string;
}

export interface Destination {
  slug: string;
  name: string;
  region: "Central" | "North" | "South" | "East";
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface TourPackage {
  slug: string;
  code: string;
  title: string;
  destinationSlugs: string[];
  duration: { days: number; nights: number };
  type: TourType;
  categories: TourCategory[];
  summary: string;
  highlights: string[];
  image: string;
  validity?: string;
  muslimFriendly?: boolean;
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  featured?: boolean;
  status: "published" | "draft";
}

export type InquiryStatus = "new" | "in-progress" | "quoted" | "closed";

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: "tour" | "transfer" | "custom" | "general";
  tourSlug?: string;
  destinationSlug?: string;
  travelDate?: string;
  pax?: number;
  message: string;
  status: InquiryStatus;
}

export interface TransferRate {
  vehicle: string;
  seats: string;
  items: { description: string; rateThb: number }[];
  notes?: string[];
}

export type UserRole = "admin" | "sales" | "viewer";
