import { SiteImage as Image } from "@/components/shared/site-image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import type { TourPackage } from "@/types";
import { formatDuration } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

export function TourCard({ tour }: { tour: TourPackage }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition hover:border-primary/30 hover:shadow-md sm:rounded-2xl">
      <Link href={`/tours/${tour.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted sm:aspect-[16/10]">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-2.5 pt-10 sm:p-4 sm:pt-16">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <StatusBadge status={tour.type} />
              {tour.muslimFriendly ? (
                <StatusBadge status="muslim" label="Muslim" />
              ) : null}
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-3 sm:space-y-3 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground sm:gap-3 sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3 sm:size-3.5" />
            {formatDuration(tour.duration.days, tour.duration.nights)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3 sm:size-3.5" />
            {tour.code}
          </span>
        </div>
        <h3 className="text-sm font-semibold leading-snug sm:text-lg">
          <Link href={`/tours/${tour.slug}`} className="hover:text-primary">
            {tour.title}
          </Link>
        </h3>
        <p className="line-clamp-2 hidden flex-1 text-sm text-muted-foreground sm:block">
          {tour.summary}
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-auto h-9 w-full justify-between text-xs sm:h-10 sm:text-sm"
        >
          <Link href={`/tours/${tour.slug}`}>
            View itinerary
            <ArrowUpRight className="size-3.5 sm:size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
