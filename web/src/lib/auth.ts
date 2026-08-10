import type { UserRole } from "@/types";

export const AUTH_COOKIE = "ggm_admin_session";

const cookiePath = process.env.NEXT_PUBLIC_BASE_PATH || "/";

export const demoUsers = [
  {
    email: "ggmthaimanagement@gmail.com",
    password: "admin123",
    name: "Admin",
    role: "admin" as UserRole,
  },
  {
    email: "ggm.thaitravel@gmail.com",
    password: "sales123",
    name: "Ms. Fon",
    role: "sales" as UserRole,
  },
];

export type SessionUser = {
  email: string;
  name: string;
  role: UserRole;
};

export function encodeSession(user: SessionUser) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(user))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeSession(token?: string): SessionUser | null {
  if (!token) return null;
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}

export function getClientSession(): SessionUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`),
  );
  return decodeSession(match?.[1] ? decodeURIComponent(match[1]) : undefined);
}

export function setClientSession(user: SessionUser) {
  const token = encodeSession(user);
  const maxAge = 60 * 60 * 12;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=${cookiePath}; max-age=${maxAge}; samesite=lax`;
}

export function clearClientSession() {
  document.cookie = `${AUTH_COOKIE}=; path=${cookiePath}; max-age=0; samesite=lax`;
}

export function authenticate(email: string, password: string) {
  const user = demoUsers.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return null;
  return {
    email: user.email,
    name: user.name,
    role: user.role,
  } satisfies SessionUser;
}
