import type { Inquiry } from "@/types";

export const seedInquiries: Inquiry[] = [
  {
    id: "inq-1001",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    name: "Aisha Rahman",
    email: "aisha@example-agency.com",
    phone: "+60 12-345 6789",
    company: "Example Travel Agency",
    inquiryType: "tour",
    tourSlug: "bangkok-4d3n-muslim",
    travelDate: "2026-11-15",
    pax: 12,
    message: "Please quote nett rates for 12 pax Muslim-friendly Bangkok 4D3N.",
    status: "new",
  },
  {
    id: "inq-1002",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    name: "David Tan",
    email: "ops@southsea.sg",
    company: "Southsea Holidays",
    inquiryType: "transfer",
    destinationSlug: "phuket",
    pax: 8,
    message: "Need VIP van airport–hotel transfer for 8 pax on 20 Nov.",
    status: "in-progress",
  },
];

/** @deprecated Prefer client inquiry store for static export builds. */
export function listInquiries() {
  return [...seedInquiries].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getInquiry(id: string) {
  return seedInquiries.find((i) => i.id === id);
}
