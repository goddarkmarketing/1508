"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminFetch } from "@/lib/admin-api";
import type { Destination, TourPackage } from "@/types";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<TourPackage[]>([]);

  useEffect(() => {
    Promise.all([
      adminFetch<{ destinations: Destination[] }>("/destinations"),
      adminFetch<{ tours: TourPackage[] }>("/tours"),
    ])
      .then(([destinationData, tourData]) => {
        setDestinations(destinationData.destinations);
        setTours(tourData.tours);
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Could not load destinations");
      });
  }, []);

  return (
    <div>
      <PageHeader
        title="Destinations"
        description="ปลายทางที่ใช้ในหน้าเว็บ แผนที่ และแพ็กเกจทัวร์"
        actions={
          <Button asChild>
            <Link href="/admin/destinations/edit">New destination</Link>
          </Button>
        }
      />
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.map((destination) => (
              <TableRow key={destination.slug}>
                <TableCell className="font-medium">{destination.name}</TableCell>
                <TableCell>{destination.region}</TableCell>
                <TableCell>
                  {tours.filter((tour) => tour.destinationSlugs.includes(destination.slug)).length}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/destinations/edit?slug=${destination.slug}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
