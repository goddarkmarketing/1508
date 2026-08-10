import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  quoted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  private: "bg-amber-50 text-amber-800 border-amber-200",
  join: "bg-sky-50 text-sky-700 border-sky-200",
  sic: "bg-violet-50 text-violet-700 border-violet-200",
  muslim: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", statusStyles[status] ?? "bg-muted", className)}
    >
      {label ?? status.replace("-", " ")}
    </Badge>
  );
}
