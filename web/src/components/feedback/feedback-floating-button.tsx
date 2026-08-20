"use client";

import { useEffect } from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { useFeedback } from "@/components/feedback/feedback-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedbackFloatingButton() {
  const { previewActive, feedbackMode, setFeedbackMode } = useFeedback();

  useEffect(() => {
    if (!feedbackMode) return;
    const previous = document.body.style.cursor;
    document.body.style.cursor = "crosshair";
    return () => {
      document.body.style.cursor = previous;
    };
  }, [feedbackMode]);

  if (!previewActive) return null;

  return (
    <div
      data-feedback-ui
      className="fixed bottom-5 right-5 z-[99990] flex flex-col items-end gap-2"
    >
      {feedbackMode ? (
        <div className="rounded-xl border bg-card px-3 py-2 text-xs shadow-lg">
          คลิกส่วนที่ต้องการแก้ไข
        </div>
      ) : null}
      <Button
        type="button"
        size="lg"
        className={cn(
          "h-12 rounded-full px-5 shadow-lg",
          feedbackMode ? "bg-navy hover:bg-navy/90" : "bg-brand hover:bg-brand/90",
        )}
        onClick={() => setFeedbackMode(!feedbackMode)}
        data-feedback-ui
      >
        {feedbackMode ? (
          <>
            <X className="size-4" />
            ปิดโหมดแจ้งแก้ไข
          </>
        ) : (
          <>
            <MessageSquarePlus className="size-4" />
            แจ้งแก้ไข
          </>
        )}
      </Button>
    </div>
  );
}
