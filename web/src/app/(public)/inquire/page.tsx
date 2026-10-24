import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { InquireFormSection } from "@/components/forms/inquire-form-section";
import { loadPublicContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Request quote",
  description: "Send a quotation request to GGM Thai Travel.",
};

export default async function InquirePage() {
  const content = await loadPublicContent();
  const tours = content.tours
    .filter((tour) => tour.status === "published")
    .map((tour) => ({ slug: tour.slug, title: tour.title }));
  const destinations = content.destinations.map((destination) => ({
    slug: destination.slug,
    name: destination.name,
  }));
  return (
    <div className="section-space">
      <div className="container-narrow">
        <PageHeader
          title="Request a quote"
          description="Tell us what you need. Sales will follow up with available options and nett rates where applicable."
        />
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">Loading form...</p>
            }
          >
            <InquireFormSection tours={tours} destinations={destinations} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
