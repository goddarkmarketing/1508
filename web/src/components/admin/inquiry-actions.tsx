"use client";

import { toast } from "sonner";
import type { InquiryStatus } from "@/types";
import { adminFetch } from "@/lib/admin-api";

export function InquiryActions({
  id,
  status,
  disabled,
  onUpdated,
}: {
  id: string;
  status: InquiryStatus;
  disabled?: boolean;
  onUpdated?: () => void;
}) {
  async function update(next: InquiryStatus) {
    try {
      await adminFetch(`/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success("Status updated");
      onUpdated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update status");
    }
  }

  return (
    <select
      className="h-9 rounded-lg border bg-background px-2 text-xs"
      value={status}
      disabled={disabled}
      onChange={(event) => update(event.target.value as InquiryStatus)}
    >
      <option value="new">New</option>
      <option value="in-progress">In progress</option>
      <option value="quoted">Quoted</option>
      <option value="closed">Closed</option>
    </select>
  );
}
