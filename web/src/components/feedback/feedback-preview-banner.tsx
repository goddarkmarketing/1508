"use client";

import { Eye, LogOut } from "lucide-react";
import { useFeedback } from "@/components/feedback/feedback-context";
import { Button } from "@/components/ui/button";

export function FeedbackPreviewBanner() {
  const { previewActive, exitPreview } = useFeedback();

  if (!previewActive) return null;

  return (
    <div
      data-feedback-ui
      className="sticky top-0 z-[99970] border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-950"
    >
      <div className="container-page flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="size-4 shrink-0" />
          <span>
            โหมดตรวจงาน — ใช้ปุ่ม <strong>แจ้งแก้ไข</strong> มุมขวาล่างเพื่อส่ง Feedback
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-amber-300 bg-white"
          onClick={exitPreview}
        >
          <LogOut className="size-4" />
          ออกจากโหมดตรวจงาน
        </Button>
      </div>
    </div>
  );
}
