"use client";

import "next-google-translate-widget/styles";
import GoogleTranslate from "next-google-translate-widget";
import { cn } from "@/lib/utils";

const languages = [
  { label: "English", value: "en", flag: "gb" },
  { label: "ไทย", value: "th", flag: "th" },
  { label: "中文", value: "zh-CN", flag: "cn" },
  { label: "Bahasa Melayu", value: "ms", flag: "my" },
  { label: "Bahasa Indonesia", value: "id", flag: "id" },
  { label: "Tiếng Việt", value: "vi", flag: "vn" },
  { label: "日本語", value: "ja", flag: "jp" },
  { label: "한국어", value: "ko", flag: "kr" },
];

export function LanguageSwitcher({
  className,
  menuAlign = "right",
}: {
  className?: string;
  menuAlign?: "left" | "right";
}) {
  return (
    <div className={cn("ggm-translate shrink-0", className)}>
      <GoogleTranslate
        pageLanguage="en"
        languages={languages}
        menuAlign={menuAlign}
        className="ggm-translate-widget"
      />
    </div>
  );
}
