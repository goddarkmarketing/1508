import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";

/** next/image wrapper that respects NEXT_PUBLIC_BASE_PATH for static export. */
export function SiteImage({ src, ...props }: ImageProps) {
  const resolved = typeof src === "string" ? withBasePath(src) : src;
  return <Image src={resolved} {...props} />;
}
