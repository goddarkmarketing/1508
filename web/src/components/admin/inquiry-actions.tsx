"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { InquiryStatus } from "@/types";

export function InquiryActions({
  id,
  status,
}: {
  id: string;
  status: InquiryStatus;
}) {
  const router = useRouter();

  async function update(next: InquiryStatus) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      toast.error("Unable to update status");
      return;
    }
    toast.success("Status updated");
    router.refresh();
  }

  return (
    <select
      className="h-9 rounded-lg border bg-background px-2 text-xs"
      value={status}
      onChange={(e) => update(e.target.value as InquiryStatus)}
    >
      <option value="new">New</option>
      <option value="in-progress">In progress</option>
      <option value="quoted">Quoted</option>
      <option value="closed">Closed</option>
    </select>
  );
}
