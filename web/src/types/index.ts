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

export type FeedbackCategory =
  | "text"
  | "image"
  | "layout"
  | "color"
  | "function"
  | "mobile"
  | "other";

export type FeedbackPriority = "low" | "medium" | "high";

export type FeedbackStatus = "pending" | "in-progress" | "completed" | "rejected";

export interface FeedbackViewport {
  width: number;
  height: number;
}

export interface FeedbackScrollPosition {
  x: number;
  y: number;
}

export interface FeedbackBoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FeedbackItem {
  id: string;
  page: string;
  url: string;
  route: string;
  section: string;
  feedbackId: string;
  selector: string;
  elementTag: string;
  elementText: string;
  componentName: string;
  comment: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  customerName: string;
  screenshot: string;
  viewport: FeedbackViewport;
  scrollPosition: FeedbackScrollPosition;
  boundingRect: FeedbackBoundingRect;
  createdAt: string;
}

export interface FeedbackElementMeta {
  page: string;
  url: string;
  route: string;
  section: string;
  feedbackId: string;
  selector: string;
  elementTag: string;
  elementText: string;
  componentName: string;
  boundingRect: FeedbackBoundingRect;
  viewport: FeedbackViewport;
  scrollPosition: FeedbackScrollPosition;
}
