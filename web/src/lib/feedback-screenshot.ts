import type { FeedbackBoundingRect } from "@/types";

const SENSITIVE_SELECTORS = [
  'input[type="password"]',
  "[data-sensitive]",
  "[data-feedback-mask]",
  'input[autocomplete="one-time-code"]',
].join(",");

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

/** Minimal annotated placeholder if screenshot capture fails. */
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
  ctx.fillText(`${feedbackId} · Screenshot unavailable`, 24, 40);
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText("Page capture failed; element bounds marked below.", 24, 68);
  drawAnnotation(canvas, rect, feedbackId);
  return canvas.toDataURL("image/png");
}

export async function captureFeedbackScreenshot(
  rect: FeedbackBoundingRect,
  feedbackId: string,
): Promise<string> {
  // html2canvas-pro supports Tailwind v4 oklab/oklch color functions.
  const html2canvas = (await import("html2canvas-pro")).default;
  const masks = maskSensitiveAreas(document.body);

  try {
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scale: 1,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      ignoreElements: (element) =>
        element instanceof Element &&
        (element.hasAttribute("data-feedback-ui") ||
          element.hasAttribute("data-feedback-mask-overlay")),
    });

    drawAnnotation(canvas, rect, feedbackId);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.warn("[Feedback] screenshot capture failed, using fallback:", error);
    return createFallbackScreenshot(rect, feedbackId);
  } finally {
    masks.forEach((mask) => mask.remove());
  }
}
