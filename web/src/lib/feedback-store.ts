import {
  clearFeedbackScreenshots,
  deleteFeedbackScreenshot,
  getFeedbackScreenshot,
  saveFeedbackScreenshot,
} from "@/lib/feedback-image-store";
import type {
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
} from "@/types";
import type { FeedbackElementMeta } from "@/types";

export const FEEDBACK_STORAGE_KEY = "ggm_feedback_v1";

type StoredFeedbackItem = Omit<FeedbackItem, "screenshot">;

function readMetadata(): StoredFeedbackItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<
      StoredFeedbackItem & { screenshot?: string }
    >;
    return parsed.map(({ screenshot: _removed, ...item }) => item);
  } catch {
    return [];
  }
}

function writeMetadata(items: StoredFeedbackItem[]) {
  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
}

/** Move legacy inline screenshots from localStorage into IndexedDB. */
export async function compactFeedbackStorage() {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!raw) return;

  let parsed: Array<StoredFeedbackItem & { screenshot?: string }>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }

  const hasInlineScreenshots = parsed.some(
    (item) => typeof item.screenshot === "string" && item.screenshot.length > 80,
  );
  if (!hasInlineScreenshots) return;

  for (const item of parsed) {
    if (item.screenshot && item.screenshot.length > 80) {
      await saveFeedbackScreenshot(item.id, item.screenshot);
    }
  }

  writeMetadata(
    parsed.map(({ screenshot: _removed, ...item }) => item),
  );
}

export function loadFeedback(): FeedbackItem[] {
  return readMetadata()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .map((item) => ({ ...item, screenshot: "" }));
}

export async function loadFeedbackWithScreenshots(): Promise<FeedbackItem[]> {
  await compactFeedbackStorage();
  const items = loadFeedback();
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      screenshot: (await getFeedbackScreenshot(item.id)) ?? "",
    })),
  );
}

function nextFeedbackId(items: StoredFeedbackItem[]): string {
  const max = items.reduce((acc, item) => {
    const num = Number(item.id.replace(/^FB-/i, ""));
    return Number.isFinite(num) ? Math.max(acc, num) : acc;
  }, 0);
  return `FB-${String(max + 1).padStart(3, "0")}`;
}

export function peekNextFeedbackId(): string {
  return nextFeedbackId(readMetadata());
}

function buildItem(
  items: StoredFeedbackItem[],
  input: {
    meta: FeedbackElementMeta;
    comment: string;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    customerName: string;
  },
): StoredFeedbackItem {
  return {
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
    viewport: input.meta.viewport,
    scrollPosition: input.meta.scrollPosition,
    boundingRect: input.meta.boundingRect,
    createdAt: new Date().toISOString(),
  };
}

export async function createFeedback(input: {
  meta: FeedbackElementMeta;
  comment: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  customerName: string;
  screenshot: string;
}): Promise<FeedbackItem> {
  await compactFeedbackStorage();

  const items = readMetadata();
  const item = buildItem(items, input);
  writeMetadata([item, ...items]);

  if (input.screenshot) {
    await saveFeedbackScreenshot(item.id, input.screenshot);
  }

  return { ...item, screenshot: input.screenshot };
}

export function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  const items = readMetadata().map((entry) =>
    entry.id === id ? { ...entry, status } : entry,
  );
  writeMetadata(items);
  return items.find((entry) => entry.id === id) ?? null;
}

export async function deleteFeedback(id: string) {
  writeMetadata(readMetadata().filter((entry) => entry.id !== id));
  await deleteFeedbackScreenshot(id);
}

export async function clearAllFeedback() {
  writeMetadata([]);
  await clearFeedbackScreenshots();
}
