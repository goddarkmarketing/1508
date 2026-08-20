import {
  CalendarDays,
  Clock3,
  Hash,
  MessageSquareQuote,
  Phone,
} from "lucide-react";
import Link from "next/link";
import type { TourPackage } from "@/types";
import { formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function TourBookingCard({ tour }: { tour: TourPackage }) {
  const rows = [
    { icon: Hash, label: "Code", value: tour.code },
    {
      icon: Clock3,
      label: "Duration",
      value: formatDuration(tour.duration.days, tour.duration.nights),
    },
    {
      icon: CalendarDays,
      label: "Validity",
      value: tour.validity ?? "On request",
    },
  ];

  return (
    <aside
      className="h-fit self-start overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_12px_32px_rgba(0,51,102,0.08)] lg:sticky lg:top-28"
      data-feedback-id="package-price"
      data-component="TourBookingCard"
    >
      <div className="border-b bg-navy px-5 py-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
          Booking summary
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-snug">{tour.title}</h3>
      </div>

      <div className="divide-y">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm"
            >
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Icon className="size-3.5" />
                {row.label}
              </span>
              <span className="font-semibold text-navy">{row.value}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t bg-[#f7f9fc] px-5 py-5">
        <p className="text-sm text-muted-foreground">
          Share travel dates and passenger count. Sales will reply with nett
          agent rates.
        </p>
        <Button asChild className="w-full bg-brand hover:bg-brand/90">
          <Link href={`/inquire?tour=${tour.slug}`}>
            <MessageSquareQuote className="size-4" />
            Request quotation
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/contact">
            <Phone className="size-4" />
            Contact sales
          </Link>
        </Button>
      </div>
    </aside>
  );
}
