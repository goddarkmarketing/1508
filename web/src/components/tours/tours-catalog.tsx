"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { TourCard } from "@/components/shared/tour-card";
import { EmptyState } from "@/components/shared/empty-state";
import { destinations } from "@/data/destinations";
import { getTourMenuByDuration } from "@/data/tour-menu";
import { getPublishedTours } from "@/data/tours";

export function ToursCatalog() {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => ({
      muslim: searchParams.get("muslim") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      destination: searchParams.get("destination") ?? undefined,
      days: searchParams.get("days") ?? undefined,
    }),
    [searchParams],
  );

  const tours = useMemo(() => {
    let list = getPublishedTours();

    if (params.muslim === "1") {
      list = list.filter((t) => t.muslimFriendly);
    }
    if (params.type) {
      list = list.filter((t) => t.type === params.type);
    }
    if (params.destination) {
      list = list.filter((t) =>
        t.destinationSlugs.includes(params.destination!),
      );
    }
    if (params.days) {
      const days = Number(params.days);
      if (Number.isFinite(days)) {
        list = list.filter((t) => t.duration.days === days);
      }
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q),
      );
    }
    return list;
  }, [params]);

  const selectedDestination = destinations.find(
    (d) => d.slug === params.destination,
  );
  const durationOptions = getTourMenuByDuration();

  return (
    <div className="section-space">
      <div className="container-page">
        <PageHeader
          title={
            selectedDestination
              ? `${selectedDestination.name} tours`
              : params.days
                ? `${params.days} Days packages`
                : "Tour packages"
          }
          description="Browse private, join, and Muslim-friendly programs ready for agent quotation."
        />

        <form className="mb-6 grid grid-cols-2 gap-2 rounded-xl border bg-card p-3 sm:mb-8 sm:gap-3 sm:rounded-2xl sm:p-4 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search by title or code"
            className="col-span-2 h-10 rounded-lg border bg-background px-3 text-sm lg:col-span-1"
          />
          <select
            name="destination"
            defaultValue={params.destination ?? ""}
            className="h-10 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All destinations</option>
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {destination.name}
              </option>
            ))}
          </select>
          <select
            name="days"
            defaultValue={params.days ?? ""}
            className="h-10 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All durations</option>
            {durationOptions.map((duration) => (
              <option key={duration.label} value={duration.days}>
                {duration.label}
              </option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="h-10 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All types</option>
            <option value="private">Private</option>
            <option value="join">Join</option>
            <option value="sic">SIC</option>
          </select>
          <label className="flex h-10 items-center gap-2 rounded-lg border px-3 text-sm">
            <input
              type="checkbox"
              name="muslim"
              value="1"
              defaultChecked={params.muslim === "1"}
            />
            Muslim
          </label>
          <button
            type="submit"
            className="col-span-2 h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground lg:col-span-1"
          >
            Filter
          </button>
        </form>

        {tours.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tours matched"
            description="Try clearing filters or search with a different keyword."
            actionLabel="Reset"
            actionHref="/tours"
          />
        )}
      </div>
    </div>
  );
}
