"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardStat } from "@/components/shared/dashboard-stat";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/components/admin/session";
import { adminFetch } from "@/lib/admin-api";
import type { Inquiry } from "@/types";

export default function AdminDashboardPage() {
  const session = useAdminSession();
  const [stats, setStats] = useState({
    tours: 0,
    draftTours: 0,
    destinations: 0,
    inquiries: 0,
    newInquiries: 0,
  });
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    Promise.all([
      adminFetch<typeof stats>("/stats"),
      adminFetch<{ inquiries: Inquiry[] }>("/inquiries"),
    ]).then(([nextStats, inquiryData]) => {
      setStats(nextStats);
      setInquiries(inquiryData.inquiries);
    }).catch(() => {
      // The layout already redirects when the session is missing.
    });
  }, []);

  return (
    <div data-feedback-id="dashboard-summary">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.name}. Catalog edits and inquiries are stored in the office database.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/admin/inquiries">Review inquiries</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/tours">Edit tours</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat label="Published tours" value={stats.tours} hint={`${stats.draftTours} drafts`} />
        <DashboardStat label="Destinations" value={stats.destinations} />
        <DashboardStat label="New inquiries" value={stats.newInquiries} hint="Awaiting first response" />
        <DashboardStat label="Total inquiries" value={stats.inquiries} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            ) : (
              inquiries.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border px-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.message}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-semibold">Quick actions</h2>
          <div className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/tours/edit">Add a tour</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/media">Update videos and photos</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/" target="_blank">
                Open public website
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
