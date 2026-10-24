"use client";

import { apiBase } from "@/lib/api-base";
import type { Inquiry } from "@/types";

export async function createInquiry(
  input: Omit<Inquiry, "id" | "createdAt" | "status">,
) {
  let response: Response;
  try {
    response = await fetch(`${apiBase()}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("เชื่อมต่อระบบหลังบ้านไม่ได้");
  }
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    inquiry?: Inquiry;
  };
  if (!response.ok || !data.inquiry) {
    throw new Error(data.error || "Submission failed");
  }
  return data.inquiry;
}
