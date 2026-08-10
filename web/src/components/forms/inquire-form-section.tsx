"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { destinations } from "@/data/destinations";
import { getPublishedTours } from "@/data/tours";
import type { InquiryFormValues } from "@/lib/validations";

export function InquireFormSection() {
  const searchParams = useSearchParams();
  const tours = getPublishedTours().map((t) => ({
    slug: t.slug,
    title: t.title,
  }));
  const destinationOptions = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
  }));

  const type = searchParams.get("type") as
    | InquiryFormValues["inquiryType"]
    | null;

  return (
    <InquiryForm
      tours={tours}
      destinations={destinationOptions}
      defaultTour={searchParams.get("tour") ?? undefined}
      defaultDestination={searchParams.get("destination") ?? undefined}
      defaultType={type ?? undefined}
    />
  );
}
