"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { InquiryActions } from "@/components/admin/inquiry-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTour } from "@/data/tours";
import { loadInquiries } from "@/lib/inquiry-store";
import type { Inquiry } from "@/types";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const refresh = useCallback(() => {
    setInquiries(loadInquiries());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div data-feedback-id="booking-table">
      <PageHeader
        title="Inquiries"
        description="Incoming quote requests from the public website form (stored in this browser for the static demo)."
      />

      {inquiries.length === 0 ? (
        <EmptyState
          title="No inquiries yet"
          description="New submissions from /inquire will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tour / message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((item) => {
                const tour = item.tourSlug ? getTour(item.tourSlug) : null;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                      {item.company ? (
                        <p className="text-xs text-muted-foreground">{item.company}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="capitalize">{item.inquiryType}</TableCell>
                    <TableCell className="max-w-xs">
                      {tour ? (
                        <p className="text-sm font-medium">{tour.title}</p>
                      ) : null}
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <InquiryActions
                        id={item.id}
                        status={item.status}
                        onUpdated={refresh}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
