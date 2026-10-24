import type { UserRole } from "@/types";

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
};

export const ADMIN_TOKEN_KEY = "ggm_admin_token";

/** True when this browser has an admin API token. Role details come from /auth/me. */
export function getClientSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  if (!sessionStorage.getItem(ADMIN_TOKEN_KEY)) return null;
  return { id: 0, email: "", name: "", role: "admin" };
}

export function canEditContent(role: string) {
  return role === "admin";
}

export function canManageInquiries(role: string) {
  return role === "admin" || role === "sales";
}
