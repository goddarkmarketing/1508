"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteFeedback } from "@/lib/feedback-store";
import { Button } from "@/components/ui/button";

export function FeedbackDeleteButton({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void;
}) {
  async function handleDelete() {
    if (!window.confirm(`ลบ ${id} ใช่ไหม?`)) return;
    try {
      await deleteFeedback(id);
      toast.success(`ลบ ${id} แล้ว`);
      onDeleted?.();
    } catch {
      toast.error("ไม่สามารถลบ Feedback ได้");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="size-4" />
      ลบ
    </Button>
  );
}
