"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/forms/inquiry-form";
import type { InquiryFormValues } from "@/lib/validations";

export function InquireFormSection({
  tours,
  destinations,
}: {
  tours: { slug: string; title: string }[];
  destinations: { slug: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const destinationOptions = destinations;

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
