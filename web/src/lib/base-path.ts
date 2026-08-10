export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix public asset paths for GitHub Pages project sites. */
export function withBasePath(path: string): string {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return path.startsWith("/") ? `${BASE_PATH}${path}` : `${BASE_PATH}/${path}`;
}
