"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
import { adminFetch } from "@/lib/admin-api";
import { formatDuration } from "@/lib/format";
import type { TourPackage } from "@/types";

export default function AdminToursPage() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    adminFetch<{ tours: TourPackage[] }>("/tours")
      .then((data) => setTours(data.tours))
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Could not load tours");
      });
  }, []);

  const visible = tours.filter((tour) => {
    const haystack = `${tour.code} ${tour.title}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div data-feedback-id="package-list">
      <PageHeader
        title="Tours"
        description="เพิ่ม แก้ไข และซ่อนแพ็กเกจได้จากที่นี่ หน้าเว็บสาธารณะใช้ข้อมูลชุดนี้"
        actions={
          <Button asChild>
            <Link href="/admin/tours/edit">New tour</Link>
          </Button>
        }
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by title or code"
        className="mb-4 h-10 w-full max-w-sm rounded-lg border bg-background px-3 text-sm"
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
            {visible.map((tour) => (
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
                <TableCell>{formatDuration(tour.duration.days, tour.duration.nights)}</TableCell>
                <TableCell>
                  <StatusBadge status={tour.type} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={tour.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/tours/edit?slug=${tour.slug}`}>Edit</Link>
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
