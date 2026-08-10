"use client";

import { seedInquiries } from "@/data/inquiries";
import type { Inquiry, InquiryStatus } from "@/types";

const STORAGE_KEY = "ggm_inquiries_v1";

function sortInquiries(items: Inquiry[]) {
  return [...items].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function loadInquiries(): Inquiry[] {
  if (typeof window === "undefined") return sortInquiries(seedInquiries);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInquiries));
      return sortInquiries(seedInquiries);
    }
    return sortInquiries(JSON.parse(raw) as Inquiry[]);
  } catch {
    return sortInquiries(seedInquiries);
  }
}

function saveInquiries(items: Inquiry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createInquiry(
  input: Omit<Inquiry, "id" | "createdAt" | "status">,
) {
  const item: Inquiry = {
    ...input,
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const next = sortInquiries([item, ...loadInquiries()]);
  saveInquiries(next);
  return item;
}

export function updateInquiryStatus(id: string, status: InquiryStatus) {
  const next = loadInquiries().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  saveInquiries(next);
  return next.find((item) => item.id === id) ?? null;
}
