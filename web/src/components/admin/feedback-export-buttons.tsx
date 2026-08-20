"use client";

import { Download, FileArchive, FileJson, FileText, Images } from "lucide-react";
import { toast } from "sonner";
import type { FeedbackItem } from "@/types";
import {
  downloadAllScreenshots,
  exportFeedbackJson,
  exportFeedbackMarkdown,
  exportFeedbackPackage,
} from "@/lib/feedback-export";
import { Button } from "@/components/ui/button";

export function FeedbackExportButtons({ items }: { items: FeedbackItem[] }) {
  const disabled = items.length === 0;

  async function run(action: () => void | Promise<void>, label: string) {
    try {
      await action();
      toast.success(label);
    } catch {
      toast.error(`ไม่สามารถ${label}ได้`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => run(() => exportFeedbackJson(items), "Export JSON แล้ว")}
      >
        <FileJson className="size-4" />
        Export JSON
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => run(() => exportFeedbackMarkdown(items), "Export Markdown แล้ว")}
      >
        <FileText className="size-4" />
        Export Markdown
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() =>
          run(() => downloadAllScreenshots(items), "Download Screenshots แล้ว")
        }
      >
        <Images className="size-4" />
        Download All Screenshots
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={disabled}
        onClick={() =>
          run(() => exportFeedbackPackage(items), "Export Feedback Package แล้ว")
        }
      >
        <FileArchive className="size-4" />
        Export Feedback Package
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() =>
          run(async () => {
            await exportFeedbackPackage(items);
          }, "ดาวน์โหลด Package สำหรับทีมงานแล้ว")
        }
      >
        <Download className="size-4" />
        ส่งให้ทีมงาน
      </Button>
    </div>
  );
}
