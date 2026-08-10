"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { InquiryStatus } from "@/types";
import { updateInquiryStatus } from "@/lib/inquiry-store";

export function InquiryActions({
  id,
  status,
  onUpdated,
}: {
  id: string;
  status: InquiryStatus;
  onUpdated?: () => void;
}) {
  const router = useRouter();

  function update(next: InquiryStatus) {
    const updated = updateInquiryStatus(id, next);
    if (!updated) {
      toast.error("Unable to update status");
      return;
    }
    toast.success("Status updated");
    onUpdated?.();
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
