import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourCard } from "@/components/shared/tour-card";
import { destinations, getDestination } from "@/data/destinations";
import { getToursByDestination } from "@/data/tours";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Destination" };
  return {
    title: destination.name,
    description: destination.description,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const relatedTours = getToursByDestination(destination.slug);

  return (
    <>
      <section className="relative isolate min-h-[50vh] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="container-page relative flex min-h-[50vh] flex-col justify-end py-12 text-white">
          <Button asChild variant="ghost" className="mb-6 w-fit text-white hover:bg-white/10 hover:text-white">
            <Link href="/destinations">
              <ArrowLeft className="size-4" />
              Destinations
            </Link>
          </Button>
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">{destination.region}</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{destination.name}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{destination.tagline}</p>
        </div>
      </section>

      <div className="section-space">
        <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="mt-4 text-muted-body">{destination.description}</p>
            <h3 className="mt-8 text-lg font-semibold">Highlights</h3>
            <ul className="mt-4 space-y-3">
              {destination.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-secondary/50 p-6">
            <h3 className="font-semibold">Plan this destination</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Request a private or group quotation with preferred dates and pax count.
            </p>
            <Button asChild className="mt-5 w-full bg-brand hover:bg-brand/90">
              <Link href={`/inquire?destination=${destination.slug}`}>Request quote</Link>
            </Button>
          </div>
        </div>

        {relatedTours.length ? (
          <div className="container-page mt-16">
            <h2 className="mb-6 text-2xl font-semibold">Packages for {destination.name}</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {relatedTours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
