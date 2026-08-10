import Link from "next/link";
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
import { destinations } from "@/data/destinations";
import { getToursByDestination } from "@/data/tours";

export default function AdminDestinationsPage() {
  return (
    <div>
      <PageHeader
        title="Destinations"
        description="Destination content used across the public website and tour mapping."
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
                <TableCell>{getToursByDestination(destination.slug).length}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/destinations/${destination.slug}`} target="_blank">
                      View
                    </Link>
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
