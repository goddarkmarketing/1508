import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DestinationCard } from "@/components/shared/destination-card";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Thailand destinations operated by GGM Thai Travel.",
};

export default function DestinationsPage() {
  const regions = ["Central", "North", "South", "East"] as const;

  return (
    <div className="section-space">
      <div className="container-page">
        <PageHeader
          title="Destinations"
          description="Pin it. Plan it. Explore Thailand — curated routes from Bangkok to the Andaman and deep south."
        />

        <div className="space-y-14">
          {regions.map((region) => {
            const items = destinations.filter((d) => d.region === region);
            if (!items.length) return null;
            return (
              <section key={region}>
                <h2 className="mb-6 text-xl font-semibold">{region}</h2>
                <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
                  {items.map((destination) => (
                    <DestinationCard key={destination.slug} destination={destination} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
