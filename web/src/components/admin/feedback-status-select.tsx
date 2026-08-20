"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FeedbackStatus } from "@/types";
import { updateFeedbackStatus } from "@/lib/feedback-store";

export function FeedbackStatusSelect({
  id,
  status,
  onUpdated,
}: {
  id: string;
  status: FeedbackStatus;
  onUpdated?: () => void;
}) {
  const router = useRouter();

  function update(next: FeedbackStatus) {
    const updated = updateFeedbackStatus(id, next);
    if (!updated) {
      toast.error("ไม่สามารถอัปเดตสถานะได้");
      return;
    }
    toast.success("อัปเดตสถานะแล้ว");
    onUpdated?.();
    router.refresh();
  }

  return (
    <select
      className="h-9 rounded-lg border bg-background px-2 text-xs"
      value={status}
      onChange={(e) => update(e.target.value as FeedbackStatus)}
    >
      <option value="pending">pending</option>
      <option value="in-progress">in-progress</option>
      <option value="completed">completed</option>
      <option value="rejected">rejected</option>
    </select>
  );
}
