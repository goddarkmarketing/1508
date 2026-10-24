import { destinations as staticDestinations } from "@/data/destinations";
import { getPublishedTours } from "@/data/tours";
import { formatDuration } from "@/lib/format";
import type { Destination, TourPackage } from "@/types";

export function getTourMenuByDestination(
  destinationList: Destination[] = staticDestinations,
  tourList: TourPackage[] = getPublishedTours(),
) {
  const tours = tourList.filter((tour) => tour.status === "published");
  return destinationList
    .map((destination) => {
      const count = tours.filter((tour) =>
        tour.destinationSlugs.includes(destination.slug),
      ).length;
      return {
        slug: destination.slug,
        name: destination.name,
        region: destination.region,
        tagline: destination.tagline,
        image: destination.image,
        href: `/tours?destination=${destination.slug}`,
        count,
      };
    })
    .filter((item) => item.count > 0);
}

export function getTourMenuByDuration(tourList: TourPackage[] = getPublishedTours()) {
  const tours = tourList.filter((tour) => tour.status === "published");
  const map = new Map<string, { days: number; nights: number; count: number }>();

  for (const tour of tours) {
    const key = formatDuration(tour.duration.days, tour.duration.nights);
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        days: tour.duration.days,
        nights: tour.duration.nights,
        count: 1,
      });
    }
  }

  return [...map.entries()]
    .map(([label, value]) => ({
      label,
      days: value.days,
      nights: value.nights,
      count: value.count,
      href: `/tours?days=${value.days}`,
    }))
    .sort((a, b) => a.days - b.days);
}
