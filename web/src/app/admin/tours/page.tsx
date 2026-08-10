import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tours } from "@/data/tours";
import { formatDuration } from "@/lib/format";

export default function AdminToursPage() {
  return (
    <div>
      <PageHeader
        title="Tours"
        description="Catalog sourced from company package materials. Editing can be connected to a database later."
        actions={
          <Button asChild variant="outline">
            <Link href="/tours" target="_blank">
              View public page
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.slug}>
                <TableCell className="font-medium">{tour.code}</TableCell>
                <TableCell>
                  <div>
                    <p>{tour.title}</p>
                    {tour.muslimFriendly ? (
                      <p className="text-xs text-emerald-700">Muslim friendly</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDuration(tour.duration.days, tour.duration.nights)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={tour.type} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={tour.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/tours/${tour.slug}`} target="_blank">
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
