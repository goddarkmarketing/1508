import type { Metadata } from "next";
import { SiteImage as Image } from "@/components/shared/site-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { TourBookingCard } from "@/components/tours/tour-booking-card";
import { TourFacts } from "@/components/tours/tour-facts";
import { TourInclusions } from "@/components/tours/tour-inclusions";
import { TourItinerary } from "@/components/tours/tour-itinerary";
import { getDestination } from "@/data/destinations";
import { getPublishedTours, getTour } from "@/data/tours";
import { formatDuration } from "@/lib/format";

export function generateStaticParams() {
  return getPublishedTours().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return { title: "Tour" };
  return { title: tour.title, description: tour.summary };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour || tour.status !== "published") notFound();

  const destinationRecords = tour.destinationSlugs
    .map((destinationSlug) => getDestination(destinationSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const destinations = destinationRecords.map((item) => item.name);
  const placeImages = [
    ...new Set([
      tour.image,
      ...destinationRecords.map((item) => item.image),
    ]),
  ];

  return (
    <>
      <section className="relative isolate min-h-[42vh] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/45" />
        <div className="container-page relative flex min-h-[42vh] flex-col justify-end py-10 text-white">
          <Button
            asChild
            variant="ghost"
            className="mb-5 w-fit text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/tours">
              <ArrowLeft className="size-4" />
              Back to tours
            </Link>
          </Button>

          <div className="mb-3 flex flex-wrap gap-2">
            <StatusBadge
              status={tour.type}
              className="border-white/20 bg-white/10 text-white"
            />
            <Badge
              variant="outline"
              className="border-white/20 bg-white/10 text-white"
            >
              {formatDuration(tour.duration.days, tour.duration.nights)}
            </Badge>
            <Badge
              variant="outline"
              className="border-white/20 bg-white/10 font-mono text-white"
            >
              {tour.code}
            </Badge>
            {tour.muslimFriendly ? (
              <StatusBadge
                status="muslim"
                label="Muslim friendly"
                className="border-white/20 bg-emerald-500/20 text-white"
              />
            ) : null}
          </div>

          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {tour.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
            {tour.summary}
          </p>
        </div>
      </section>

      <div className="section-space">
        <div className="container-page space-y-8">
          <TourFacts tour={tour} destinations={destinations} />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">
              <section className="overflow-hidden rounded-2xl border border-border/80 bg-white">
                <div className="flex items-center gap-2 border-b bg-[#f7f9fc] px-5 py-4">
                  <Sparkles className="size-4 text-sky-600" />
                  <h2 className="text-xl font-semibold text-navy">Highlights</h2>
                </div>
                <ul className="grid sm:grid-cols-2">
                  {tour.highlights.map((item, index) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2.5 border-b border-border/60 px-5 py-3.5 text-sm sm:odd:border-r ${
                        index % 2 === 1 ? "bg-[#fafbfd]" : ""
                      }`}
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-navy/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <TourItinerary days={tour.itinerary} placeImages={placeImages} />

              {tour.muslimFriendly ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Special note: Friday Prayer at Mosque can be arranged on
                  Muslim-friendly programs.
                </p>
              ) : null}

              <TourInclusions
                includes={tour.includes}
                excludes={tour.excludes}
              />
            </div>

            <TourBookingCard tour={tour} />
          </div>
        </div>
      </div>
    </>
  );
}
