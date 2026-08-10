import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock3,
  Hash,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { TourPackage } from "@/types";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

type Fact = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function TourFacts({
  tour,
  destinations,
  className,
}: {
  tour: TourPackage;
  destinations: string[];
  className?: string;
}) {
  const facts: Fact[] = [
    {
      icon: Hash,
      label: "Package code",
      value: tour.code,
    },
    {
      icon: Clock3,
      label: "Duration",
      value: `${formatDuration(tour.duration.days, tour.duration.nights)} · ${tour.duration.days}D / ${tour.duration.nights}N`,
    },
    {
      icon: Users,
      label: "Tour type",
      value: tour.type.toUpperCase(),
    },
    {
      icon: MapPin,
      label: "Destinations",
      value: destinations.join(" · ") || "Thailand",
    },
  ];

  if (tour.validity) {
    facts.push({
      icon: CalendarDays,
      label: "Validity",
      value: tour.validity,
    });
  }

  if (tour.muslimFriendly) {
    facts.push({
      icon: ShieldCheck,
      label: "Special",
      value: "Muslim friendly",
    });
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_10px_30px_rgba(0,51,102,0.06)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b bg-navy px-5 py-3.5 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
            Trip overview
          </p>
          <p className="text-sm font-medium">Package summary at a glance</p>
        </div>
        <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-wide">
          {tour.code}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div
              key={fact.label}
              className="flex gap-3 border-b border-r border-border/60 px-4 py-3.5 last:border-b-0 odd:bg-[#f7f9fc] sm:px-5 sm:py-4 sm:odd:bg-transparent sm:even:bg-[#f7f9fc] lg:[&:nth-child(3n)]:border-r-0"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary sm:size-9">
                <Icon className="size-3.5 sm:size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">
                  {fact.label}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-navy">{fact.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
