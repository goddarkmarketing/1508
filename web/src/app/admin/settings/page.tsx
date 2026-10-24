"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { BackupManager } from "@/components/admin/backup-manager";
import { UserManager } from "@/components/admin/user-manager";
import { useAdminSession } from "@/components/admin/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { company } from "@/data/company";
import { adminFetch } from "@/lib/admin-api";
import { canEditContent } from "@/lib/auth";

export default function AdminSettingsPage() {
  const session = useAdminSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="โปรไฟล์บริษัท และสิทธิ์ของทีมที่เข้าหลังบ้าน" />

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
              <dd className="font-medium">{session.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{session.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium capitalize">{session.role}</dd>
            </div>
          </dl>
          <form
            className="mt-6 grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await adminFetch("/auth/password", {
                  method: "PATCH",
                  body: JSON.stringify({ current: currentPassword, next: nextPassword }),
                });
                setCurrentPassword("");
                setNextPassword("");
                toast.success("Password updated");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not update the password");
              }
            }}
          >
            <h3 className="font-medium">Change your password</h3>
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New password (10+ characters)"
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
              required
            />
            <Button type="submit" className="w-fit">
              Update password
            </Button>
          </form>
        </section>
      </div>

      {canEditContent(session.role) ? (
        <>
          <BackupManager />
          <UserManager currentId={session.id} />
        </>
      ) : null}
    </div>
  );
}
