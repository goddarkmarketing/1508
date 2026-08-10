import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardStat } from "@/components/shared/dashboard-stat";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { listInquiries } from "@/data/inquiries";
import { destinations } from "@/data/destinations";
import { getPublishedTours } from "@/data/tours";
import { getSession } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const tours = getPublishedTours();
  const inquiries = listInquiries();
  const newInquiries = inquiries.filter((i) => i.status === "new");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session?.name ?? "team"}. Focus on pending inquiries and live packages.`}
        actions={
          <Button asChild>
            <Link href="/admin/inquiries">Review inquiries</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat label="Published tours" value={tours.length} />
        <DashboardStat label="Destinations" value={destinations.length} />
        <DashboardStat
          label="New inquiries"
          value={newInquiries.length}
          hint="Awaiting first response"
        />
        <DashboardStat label="Total inquiries" value={inquiries.length} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Pending inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {inquiries.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.email}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {item.message}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-semibold">Quick actions</h2>
          <div className="grid gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/tours">Manage tour catalog</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/destinations">Review destinations</Link>
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
