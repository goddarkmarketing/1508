import { getClientSession } from "@/lib/auth";

export const PREVIEW_SESSION_KEY = "ggm_preview_session";

const previewPassword =
  process.env.NEXT_PUBLIC_PREVIEW_PASSWORD || "ggmreview2026";

/** Shared review link token (set via NEXT_PUBLIC_PREVIEW_TOKEN). */
const previewToken =
  process.env.NEXT_PUBLIC_PREVIEW_TOKEN || previewPassword;

export function verifyPreviewPassword(password: string): boolean {
  return password.trim() === previewPassword;
}

export function verifyPreviewToken(token: string): boolean {
  return token.trim() === previewToken;
}

export function setPreviewSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PREVIEW_SESSION_KEY, "1");
}

export function clearPreviewSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PREVIEW_SESSION_KEY);
}

export function hasPreviewSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PREVIEW_SESSION_KEY) === "1";
}

/** Preview mode: admin login, stored session, or valid ?preview= token. */
export function isPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  if (getClientSession()) return true;
  if (hasPreviewSession()) return true;

  const params = new URLSearchParams(window.location.search);
  const token = params.get("preview");
  if (token && verifyPreviewToken(token)) {
    setPreviewSession();
    return true;
  }

  return false;
}

export function getPreviewAccessUrl(path = "/"): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}?preview=${encodeURIComponent(previewToken)}`;
}
