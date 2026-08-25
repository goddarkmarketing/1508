import type { FeedbackBoundingRect } from "@/types";

const SENSITIVE_SELECTORS = [
  'input[type="password"]',
  "[data-sensitive]",
  "[data-feedback-mask]",
  'input[autocomplete="one-time-code"]',
].join(",");

const MAX_SCREENSHOT_WIDTH = 1280;
const JPEG_QUALITY = 0.72;

function maskSensitiveAreas(root: HTMLElement) {
  const masks: HTMLElement[] = [];
  root.querySelectorAll(SENSITIVE_SELECTORS).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const overlay = document.createElement("div");
    const rect = node.getBoundingClientRect();
    overlay.setAttribute("data-feedback-mask-overlay", "true");
    overlay.style.position = "fixed";
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.background = "#e5e7eb";
    overlay.style.color = "#6b7280";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.fontSize = "12px";
    overlay.style.zIndex = "999998";
    overlay.textContent = "Hidden";
    document.body.appendChild(overlay);
    masks.push(overlay);
  });
  return masks;
}

function getCaptureTarget(element: Element | null): HTMLElement {
  if (element instanceof HTMLElement) {
    const section = element.closest("section[data-feedback-id], section, main");
    if (section instanceof HTMLElement) return section;
    return element;
  }
  return document.documentElement;
}

function toRelativeRect(
  targetRect: DOMRect,
  selected: FeedbackBoundingRect,
): FeedbackBoundingRect {
  return {
    x: Math.round(selected.x - targetRect.x),
    y: Math.round(selected.y - targetRect.y),
    width: selected.width,
    height: selected.height,
  };
}

function sanitizeCloneStyles(clonedDoc: Document) {
  const styleNodes = Array.from(clonedDoc.querySelectorAll("style"));
  for (const node of styleNodes) {
    const css = node.textContent;
    if (!css) continue;
    if (
      !/oklab\(|oklch\(|color-mix\(/i.test(css)
    ) {
      continue;
    }
    node.textContent = css
      .replace(/oklab\([^)]*\)/gi, "rgb(128,128,128)")
      .replace(/oklch\([^)]*\)/gi, "rgb(128,128,128)")
      .replace(/color-mix\([^)]*\)/gi, "rgb(128,128,128)");
  }

  clonedDoc.querySelectorAll("[style]").forEach((node) => {
    const style = node.getAttribute("style");
    if (!style || !/oklab\(|oklch\(|color-mix\(/i.test(style)) return;
    node.setAttribute(
      "style",
      style
        .replace(/oklab\([^)]*\)/gi, "rgb(128,128,128)")
        .replace(/oklch\([^)]*\)/gi, "rgb(128,128,128)")
        .replace(/color-mix\([^)]*\)/gi, "rgb(128,128,128)"),
    );
  });
}

function drawAnnotation(
  canvas: HTMLCanvasElement,
  rect: FeedbackBoundingRect,
  label: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 3;
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

  const badgePaddingX = 8;
  ctx.font = "bold 14px sans-serif";
  const textWidth = ctx.measureText(label).width;
  const badgeWidth = textWidth + badgePaddingX * 2;
  const badgeHeight = 22;
  const badgeX = rect.x;
  const badgeY = Math.max(4, rect.y - badgeHeight - 4);

  ctx.fillStyle = "#dc2626";
  ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, badgeX + badgePaddingX, badgeY + 16);
}

function compressCanvas(canvas: HTMLCanvasElement): string {
  const scale = Math.min(1, MAX_SCREENSHOT_WIDTH / canvas.width);
  const output = document.createElement("canvas");
  output.width = Math.round(canvas.width * scale);
  output.height = Math.round(canvas.height * scale);
  const ctx = output.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  ctx.drawImage(canvas, 0, 0, output.width, output.height);
  return output.toDataURL("image/jpeg", JPEG_QUALITY);
}

function createFallbackScreenshot(
  rect: FeedbackBoundingRect,
  feedbackId: string,
): string {
  const width = Math.max(320, Math.round(window.innerWidth));
  const height = Math.max(240, Math.round(window.innerHeight));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(`${feedbackId} · ภาพตัวอย่าง`, 24, 40);
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("บันทึกตำแหน่งที่เลือกแล้ว (ไม่มีภาพแคปจอเต็มหน้า)", 24, 68);
  drawAnnotation(canvas, rect, feedbackId);
  return compressCanvas(canvas);
}

export async function captureFeedbackScreenshot(
  rect: FeedbackBoundingRect,
  feedbackId: string,
  selectedElement: Element | null,
): Promise<string> {
  const target = getCaptureTarget(selectedElement);
  const targetRect = target.getBoundingClientRect();
  const relativeRect = toRelativeRect(targetRect, rect);
  const masks = maskSensitiveAreas(document.body);

  try {
    let html2canvas: typeof import("html2canvas-pro").default;
    try {
      html2canvas = (await import("html2canvas-pro")).default;
    } catch (importError) {
      console.warn("[Feedback] html2canvas-pro unavailable:", importError);
      return createFallbackScreenshot(rect, feedbackId);
    }

    const canvas = await html2canvas(target, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scale: 1,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        sanitizeCloneStyles(clonedDoc);
      },
      ignoreElements: (element) =>
        element instanceof Element &&
        (element.hasAttribute("data-feedback-ui") ||
          element.hasAttribute("data-feedback-mask-overlay")),
    });

    drawAnnotation(canvas, relativeRect, feedbackId);
    return compressCanvas(canvas);
  } catch (error) {
    console.warn("[Feedback] screenshot capture failed, using fallback:", error);
    return createFallbackScreenshot(rect, feedbackId);
  } finally {
    masks.forEach((mask) => mask.remove());
  }
}
