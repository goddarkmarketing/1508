import type { Metadata } from "next";
import { Suspense } from "react";
import { ToursCatalog } from "@/components/tours/tours-catalog";
import { loadPublicContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Tours",
  description: "Private and join tour packages by GGM Thai Travel.",
};

export default async function ToursPage() {
  const content = await loadPublicContent();
  return (
    <Suspense
      fallback={
        <div className="section-space container-page text-sm text-muted-foreground">
          Loading tours...
        </div>
      }
    >
      <ToursCatalog packages={content.tours} destinationList={content.destinations} />
    </Suspense>
  );
}
