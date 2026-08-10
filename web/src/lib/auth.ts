import { cookies } from "next/headers";
import type { UserRole } from "@/types";

export const AUTH_COOKIE = "ggm_admin_session";

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

export function encodeSession(user: {
  email: string;
  name: string;
  role: UserRole;
}) {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

export function decodeSession(token?: string) {
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as {
      email: string;
      name: string;
      role: UserRole;
    };
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return decodeSession(jar.get(AUTH_COOKIE)?.value);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) return null;
  return session;
}
