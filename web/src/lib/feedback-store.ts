import type {
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
} from "@/types";
import type { FeedbackElementMeta } from "@/types";

export const FEEDBACK_STORAGE_KEY = "ggm_feedback_v1";

function readAll(): FeedbackItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FeedbackItem[];
  } catch {
    return [];
  }
}

function writeAll(items: FeedbackItem[]) {
  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
}

export function loadFeedback(): FeedbackItem[] {
  return readAll().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

function nextFeedbackId(items: FeedbackItem[]): string {
  const max = items.reduce((acc, item) => {
    const num = Number(item.id.replace(/^FB-/i, ""));
    return Number.isFinite(num) ? Math.max(acc, num) : acc;
  }, 0);
  return `FB-${String(max + 1).padStart(3, "0")}`;
}

export function peekNextFeedbackId(): string {
  return nextFeedbackId(readAll());
}

export function createFeedback(input: {
  meta: FeedbackElementMeta;
  comment: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  customerName: string;
  screenshot: string;
}): FeedbackItem {
  const items = readAll();
  const item: FeedbackItem = {
    id: nextFeedbackId(items),
    page: input.meta.page,
    url: input.meta.url,
    route: input.meta.route,
    section: input.meta.section,
    feedbackId: input.meta.feedbackId,
    selector: input.meta.selector,
    elementTag: input.meta.elementTag,
    elementText: input.meta.elementText,
    componentName: input.meta.componentName,
    comment: input.comment,
    category: input.category,
    priority: input.priority,
    status: "pending",
    customerName: input.customerName,
    screenshot: input.screenshot,
    viewport: input.meta.viewport,
    scrollPosition: input.meta.scrollPosition,
    boundingRect: input.meta.boundingRect,
    createdAt: new Date().toISOString(),
  };
  writeAll([item, ...items]);
  return item;
}

export function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  const items = readAll().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  writeAll(items);
  return items.find((item) => item.id === id) ?? null;
}

export function deleteFeedback(id: string) {
  const items = readAll().filter((item) => item.id !== id);
  writeAll(items);
}

export function clearAllFeedback() {
  writeAll([]);
}
