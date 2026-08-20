import type { FeedbackBoundingRect, FeedbackElementMeta } from "@/types";

const FEEDBACK_UI_SELECTOR = "[data-feedback-ui]";

export function isFeedbackUiElement(element: Element | null): boolean {
  if (!element) return true;
  return Boolean(element.closest(FEEDBACK_UI_SELECTOR));
}

function trimText(text: string, max = 120) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max)}…`;
}

function getFeedbackId(element: Element): string {
  const withId = element.closest("[data-feedback-id]");
  return withId?.getAttribute("data-feedback-id") ?? "";
}

function getComponentName(element: Element): string {
  const named = element.closest("[data-component]");
  if (named?.getAttribute("data-component")) {
    return named.getAttribute("data-component") ?? "";
  }
  const feedbackId = getFeedbackId(element);
  if (feedbackId) return feedbackId;
  return element.tagName.toLowerCase();
}

function getSectionLabel(element: Element): string {
  const section = element.closest("section[data-feedback-id], [data-feedback-id]");
  if (section?.getAttribute("data-feedback-label")) {
    return section.getAttribute("data-feedback-label") ?? "";
  }
  if (section?.getAttribute("data-feedback-id")) {
    return section.getAttribute("data-feedback-id") ?? "";
  }
  return getComponentName(element);
}

function escapeSelector(value: string) {
  if (typeof CSS !== "undefined" && CSS.escape) {
    return CSS.escape(value);
  }
  return value.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function buildSelector(element: Element): string {
  const feedbackId = getFeedbackId(element);
  if (feedbackId) {
    return `[data-feedback-id="${escapeSelector(feedbackId)}"]`;
  }

  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current.tagName.toLowerCase() !== "html") {
    let part = current.tagName.toLowerCase();
    const id = current.getAttribute("id");
    if (id) {
      part += `#${escapeSelector(id)}`;
      parts.unshift(part);
      break;
    }

    const classes = Array.from(current.classList)
      .filter((c) => !c.startsWith("animate-"))
      .slice(0, 2);
    if (classes.length) {
      part += `.${classes.map(escapeSelector).join(".")}`;
    }

    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child): child is Element =>
          child instanceof Element && child.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        part += `:nth-of-type(${index})`;
      }
    }

    parts.unshift(part);
    current = parent;
    if (parts.length >= 5) break;
  }

  return parts.join(" > ");
}

function rectToObject(rect: DOMRect): FeedbackBoundingRect {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

export function collectElementMeta(element: Element): FeedbackElementMeta {
  const route =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "";

  return {
    page: typeof document !== "undefined" ? document.title : "",
    url: typeof window !== "undefined" ? window.location.href : "",
    route,
    section: getSectionLabel(element),
    feedbackId: getFeedbackId(element),
    selector: buildSelector(element),
    elementTag: element.tagName.toLowerCase(),
    elementText: trimText(element.textContent ?? ""),
    componentName: getComponentName(element),
    boundingRect: rectToObject(element.getBoundingClientRect()),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    scrollPosition: {
      x: window.scrollX,
      y: window.scrollY,
    },
  };
}

export function findSelectableElement(x: number, y: number): Element | null {
  const stack = document.elementsFromPoint(x, y);
  for (const el of stack) {
    if (isFeedbackUiElement(el)) continue;
    if (el.tagName.toLowerCase() === "html") continue;
    if (el.tagName.toLowerCase() === "body") continue;
    return el;
  }
  return null;
}
