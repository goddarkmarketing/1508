"use client";

import { useEffect, useRef, useState } from "react";
import { SiteImage as Image } from "@/components/shared/site-image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import type { TourPackage } from "@/types";
import { formatDuration } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

export function TourSlider({ tours }: { tours: TourPackage[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-tour-slide]");
    const amount = card ? card.offsetWidth + 16 : 300;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const next = el.scrollLeft + direction * amount;

    if (direction > 0 && next >= maxScroll - 8) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && el.scrollLeft <= 8) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  useEffect(() => {
    if (paused || tours.length <= 1) return;

    const timer = window.setInterval(() => {
      scrollByCard(1);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [paused, tours.length]);

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Featured packages
          </p>
          <h2 className="text-xl font-semibold sm:text-2xl">
            Ready-to-quote tour programs
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Private and join tours curated from our 2025–2026 B2B tariff.
          </p>
        </div>
        <div className="mt-4 flex shrink-0 items-center gap-2 sm:mt-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous tours"
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next tours"
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/tours">View all</Link>
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 scrollbar-none"
      >
        {tours.map((tour) => (
          <Link
            key={tour.slug}
            href={`/tours/${tour.slug}`}
            data-tour-slide
            className="group flex w-[min(88vw,340px)] shrink-0 snap-start items-center gap-3 rounded-xl border bg-card p-2.5 pr-3 transition hover:border-primary/40 hover:bg-secondary/40 sm:w-[380px]"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted aspect-square">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={tour.type} />
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock3 className="size-3" />
                  {formatDuration(tour.duration.days, tour.duration.nights)}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{tour.code}</span>
              </div>
              <p className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                {tour.title}
              </p>
              {tour.muslimFriendly ? (
                <p className="text-xs text-emerald-700">Muslim friendly</p>
              ) : null}
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition group-hover:border-primary group-hover:text-primary">
              <ArrowUpRight className="size-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
