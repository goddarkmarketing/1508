import { PageHeader } from "@/components/shared/page-header";
import { company } from "@/data/company";
import { getSession } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const session = await getSession();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Company profile and role access for the back office."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-semibold">Company profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{company.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Thai name</dt>
              <dd className="font-medium">{company.nameTh}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">TAT license</dt>
              <dd className="font-medium">{company.tatLicense}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Primary email</dt>
              <dd className="font-medium">{company.emails.general}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-semibold">Current session</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{session?.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{session?.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium capitalize">{session?.role}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">
            Roles: admin (full access), sales (inquiries & catalog), viewer (read-only —
            ready for future permission matrix).
          </p>
        </section>
      </div>
    </div>
  );
}
