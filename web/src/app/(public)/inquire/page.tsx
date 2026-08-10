import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { destinations } from "@/data/destinations";
import { getPublishedTours } from "@/data/tours";

export const metadata: Metadata = {
  title: "Request quote",
  description: "Send a quotation request to GGM Thai Travel.",
};

export default async function InquirePage({
  searchParams,
}: {
  searchParams: Promise<{
    tour?: string;
    destination?: string;
    type?: "tour" | "transfer" | "custom" | "general";
  }>;
}) {
  const params = await searchParams;
  const tours = getPublishedTours().map((t) => ({ slug: t.slug, title: t.title }));
  const destinationOptions = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
  }));

  return (
    <div className="section-space">
      <div className="container-narrow">
        <PageHeader
          title="Request a quote"
          description="Tell us what you need. Sales will follow up with available options and nett rates where applicable."
        />
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <InquiryForm
            tours={tours}
            destinations={destinationOptions}
            defaultTour={params.tour}
            defaultDestination={params.destination}
            defaultType={params.type}
          />
        </div>
      </div>
    </div>
  );
}
