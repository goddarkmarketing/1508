"use client";

import { apiBase } from "@/lib/api-base";
import { ADMIN_TOKEN_KEY, type SessionUser } from "@/lib/auth";

const TOKEN_KEY = ADMIN_TOKEN_KEY;

export function getToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, { ...init, headers });
  } catch {
    throw new Error("เชื่อมต่อระบบหลังบ้านไม่ได้ ตรวจว่า API รันอยู่");
  }
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (response.status === 401 && !path.startsWith("/auth/login")) {
    clearToken();
  }
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export async function downloadBackup(name: string) {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${apiBase()}/backups/${encodeURIComponent(name)}`, { headers });
  } catch {
    throw new Error("เชื่อมต่อระบบหลังบ้านไม่ได้ ตรวจว่า API รันอยู่");
  }
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Download failed");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  const data = await adminFetch<{ path: string }>("/media", { method: "POST", body });
  return data.path;
}
