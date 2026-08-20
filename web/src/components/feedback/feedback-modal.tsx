"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useFeedback } from "@/components/feedback/feedback-context";
import { captureFeedbackScreenshot } from "@/lib/feedback-screenshot";
import { createFeedback, peekNextFeedbackId } from "@/lib/feedback-store";
import {
  feedbackSchema,
  type FeedbackFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categoryOptions = [
  { value: "text", label: "ข้อความ" },
  { value: "image", label: "รูปภาพ" },
  { value: "layout", label: "Layout" },
  { value: "color", label: "สี" },
  { value: "function", label: "ฟังก์ชัน" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "อื่น ๆ" },
] as const;

const priorityOptions = [
  { value: "low", label: "ต่ำ" },
  { value: "medium", label: "ปานกลาง" },
  { value: "high", label: "สูง" },
] as const;

export function FeedbackModal() {
  const {
    modalOpen,
    setModalOpen,
    selectedMeta,
    clearSelection,
    setFeedbackMode,
  } = useFeedback();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      comment: "",
      category: "text",
      priority: "medium",
      customerName: "",
    },
  });

  function closeModal() {
    setModalOpen(false);
    clearSelection();
    reset();
  }

  async function onSubmit(values: FeedbackFormValues) {
    if (!selectedMeta) return;
    setSubmitting(true);
    try {
      const nextId = peekNextFeedbackId();
      let screenshot = "";
      try {
        screenshot = await captureFeedbackScreenshot(
          selectedMeta.boundingRect,
          nextId,
        );
      } catch (shotError) {
        console.warn("[Feedback] screenshot skipped:", shotError);
      }

      const item = createFeedback({
        meta: selectedMeta,
        comment: values.comment,
        category: values.category,
        priority: values.priority,
        customerName: values.customerName,
        screenshot,
      });
      toast.success(`บันทึก ${item.id} แล้ว`, {
        description: screenshot
          ? "ทีมงานสามารถ Export ไฟล์ไปให้ Cursor แก้ไขได้"
          : "บันทึกแล้ว (ไม่มีภาพแคปจอ)",
      });
      closeModal();
    } catch (error) {
      console.error("[Feedback] save failed:", error);
      const message =
        error instanceof Error ? error.message : "ไม่สามารถบันทึก Feedback ได้";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
        else setModalOpen(true);
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        data-feedback-ui
        showCloseButton={!submitting}
      >
        <DialogHeader>
          <DialogTitle>แจ้งแก้ไข</DialogTitle>
          <DialogDescription>
            ระบุรายละเอียดที่ต้องการปรับในส่วนที่เลือก
          </DialogDescription>
        </DialogHeader>

        {selectedMeta ? (
          <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">หน้า:</span>{" "}
              {selectedMeta.page}
            </p>
            <p className="mt-1">
              <span className="font-medium text-foreground">ส่วน:</span>{" "}
              {selectedMeta.section || selectedMeta.feedbackId || selectedMeta.componentName}
            </p>
            {selectedMeta.elementText ? (
              <p className="mt-1 line-clamp-2">
                <span className="font-medium text-foreground">ข้อความ:</span>{" "}
                {selectedMeta.elementText}
              </p>
            ) : null}
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">ชื่อลูกค้า</Label>
            <Input
              id="customerName"
              placeholder="ชื่อผู้ตรวจงาน"
              disabled={submitting}
              {...register("customerName")}
            />
            {errors.customerName ? (
              <p className="text-xs text-destructive">{errors.customerName.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">ประเภท</Label>
              <select
                id="category"
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                disabled={submitting}
                {...register("category")}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">ความสำคัญ</Label>
              <select
                id="priority"
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                disabled={submitting}
                {...register("priority")}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">รายละเอียดที่ต้องการแก้ไข</Label>
            <Textarea
              id="comment"
              rows={5}
              placeholder="อธิบายสิ่งที่ต้องการเปลี่ยน เช่น ขนาดตัวอักษร สี หรือตำแหน่ง"
              disabled={submitting}
              {...register("comment")}
            />
            {errors.comment ? (
              <p className="text-xs text-destructive">{errors.comment.message}</p>
            ) : null}
          </div>

          <DialogFooter className="px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => {
                closeModal();
                setFeedbackMode(true);
              }}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                "บันทึก"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
