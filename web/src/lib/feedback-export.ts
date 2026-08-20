import JSZip from "jszip";
import type { FeedbackItem } from "@/types";

const categoryLabels: Record<FeedbackItem["category"], string> = {
  text: "ข้อความ",
  image: "รูปภาพ",
  layout: "Layout",
  color: "สี",
  function: "ฟังก์ชัน",
  mobile: "Mobile",
  other: "อื่น ๆ",
};

const priorityLabels: Record<FeedbackItem["priority"], string> = {
  low: "ต่ำ",
  medium: "ปานกลาง",
  high: "สูง",
};

const statusLabels: Record<FeedbackItem["status"], string> = {
  pending: "pending",
  "in-progress": "in-progress",
  completed: "completed",
  rejected: "rejected",
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function exportFeedbackJson(items: FeedbackItem[]) {
  const payload = items.map(({ screenshot, ...rest }) => ({
    ...rest,
    screenshot: rest.id ? `./images/${rest.id}.png` : "",
  }));
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, "feedback.json");
}

export function buildFeedbackMarkdown(items: FeedbackItem[]): string {
  const lines = ["# รายการแก้ไขจากลูกค้า", ""];

  for (const item of items) {
    lines.push(`## ${item.id}`);
    lines.push(`- หน้า: ${item.page}`);
    lines.push(`- URL: ${item.url}`);
    lines.push(`- ส่วน: ${item.section || item.feedbackId || item.componentName}`);
    lines.push(`- Selector: \`${item.selector}\``);
    lines.push(`- ประเภท: ${categoryLabels[item.category]}`);
    lines.push(`- ความสำคัญ: ${priorityLabels[item.priority]}`);
    lines.push(`- สถานะ: ${statusLabels[item.status]}`);
    if (item.customerName) {
      lines.push(`- ผู้แจ้ง: ${item.customerName}`);
    }
    lines.push("");
    lines.push("### รายละเอียด");
    lines.push(item.comment);
    lines.push("");
    if (item.screenshot) {
      lines.push("### รูปภาพ");
      lines.push(`![${item.id}](./images/${item.id}.png)`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

export function exportFeedbackMarkdown(items: FeedbackItem[]) {
  const blob = new Blob([buildFeedbackMarkdown(items)], {
    type: "text/markdown;charset=utf-8",
  });
  downloadBlob(blob, "FEEDBACK.md");
}

export async function downloadAllScreenshots(items: FeedbackItem[]) {
  const zip = new JSZip();
  const folder = zip.folder("images");
  if (!folder) return;

  for (const item of items) {
    if (!item.screenshot) continue;
    folder.file(`${item.id}.png`, dataUrlToUint8Array(item.screenshot));
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, "feedback-screenshots.zip");
}

export async function exportFeedbackPackage(items: FeedbackItem[]) {
  const zip = new JSZip();
  const images = zip.folder("images");
  if (!images) return;

  for (const item of items) {
    if (item.screenshot) {
      images.file(`${item.id}.png`, dataUrlToUint8Array(item.screenshot));
    }
  }

  const jsonPayload = items.map(({ screenshot, ...rest }) => ({
    ...rest,
    screenshot: screenshot ? `./images/${rest.id}.png` : "",
  }));

  zip.file("feedback.json", JSON.stringify(jsonPayload, null, 2));
  zip.file("FEEDBACK.md", buildFeedbackMarkdown(items));

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, "feedback-package.zip");
}

export { categoryLabels, priorityLabels, statusLabels };
