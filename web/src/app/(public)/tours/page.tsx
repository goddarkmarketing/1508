import type { Metadata } from "next";
import { Suspense } from "react";
import { ToursCatalog } from "@/components/tours/tours-catalog";

export const metadata: Metadata = {
  title: "Tours",
  description: "Private and join tour packages by GGM Thai Travel.",
};

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <div className="section-space container-page text-sm text-muted-foreground">
          Loading tours...
        </div>
      }
    >
      <ToursCatalog />
    </Suspense>
  );
}
