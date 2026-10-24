"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { InquiryActions } from "@/components/admin/inquiry-actions";
import { useAdminSession } from "@/components/admin/session";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminFetch } from "@/lib/admin-api";
import { canManageInquiries } from "@/lib/auth";
import type { Inquiry, InquiryStatus } from "@/types";

export default function AdminInquiriesPage() {
  const session = useAdminSession();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<InquiryStatus | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = useCallback(() => {
    adminFetch<{ inquiries: Inquiry[] }>("/inquiries")
      .then((data) => setInquiries(data.inquiries))
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Could not load inquiries");
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const visible = useMemo(() => {
    return inquiries.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      const haystack = `${item.name} ${item.email} ${item.message} ${item.phone ?? ""} ${item.company ?? ""}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [inquiries, query, status]);

  const active = inquiries.find((item) => item.id === selected) ?? null;

  return (
    <div data-feedback-id="booking-table">
      <PageHeader
        title="Inquiries"
        description="คำขอใบเสนอราคาจากหน้าเว็บถูกเก็บในฐานข้อมูล และทีมที่ล็อกอินคนละเครื่องเห็นรายการเดียวกัน"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, or message"
          className="h-10 w-full max-w-sm rounded-lg border bg-background px-3 text-sm"
        />
        <select
          className="h-10 rounded-lg border bg-background px-3 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value as InquiryStatus | "all")}
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In progress</option>
          <option value="quoted">Quoted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No inquiries yet" description="New submissions from the website will appear here." />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item) => (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item.id)}>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                    {item.phone ? <p className="text-xs text-muted-foreground">{item.phone}</p> : null}
                  </TableCell>
                  <TableCell className="text-sm">
                    <p className="capitalize">{item.inquiryType}</p>
                    <p className="text-xs text-muted-foreground">
                      {[item.destinationSlug, item.travelDate, item.pax ? `${item.pax} pax` : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {active ? (
        <section className="mt-6 rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{active.name}</h2>
              <p className="text-sm text-muted-foreground">{active.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">{active.createdAt}</p>
            </div>
            <InquiryActions
              id={active.id}
              status={active.status}
              disabled={!canManageInquiries(session.role)}
              onUpdated={refresh}
            />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{active.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Company</dt>
              <dd>{active.company || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tour</dt>
              <dd>{active.tourSlug || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Destination</dt>
              <dd>{active.destinationSlug || "—"}</dd>
            </div>
          </dl>
          <p className="mt-4 whitespace-pre-wrap text-sm">{active.message}</p>
          {canManageInquiries(session.role) ? (
            <label className="mt-4 block text-sm">
              <span className="text-muted-foreground">Internal note</span>
              <textarea
                className="mt-1 min-h-20 w-full rounded-lg border bg-background px-3 py-2"
                defaultValue={active.note ?? ""}
                key={active.id + (active.note ?? "")}
                onBlur={async (event) => {
                  try {
                    await adminFetch(`/inquiries/${active.id}`, {
                      method: "PATCH",
                      body: JSON.stringify({ note: event.target.value }),
                    });
                    refresh();
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Could not save the note");
                  }
                }}
              />
            </label>
          ) : active.note ? (
            <p className="mt-4 text-sm text-muted-foreground">{active.note}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
