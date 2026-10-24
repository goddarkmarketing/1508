export function apiBase() {
  const configured = process.env.NEXT_PUBLIC_API_BASE;
  if (configured) return configured.replace(/\/$/, "");
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}/api`;
}
