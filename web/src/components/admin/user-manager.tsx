"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch } from "@/lib/admin-api";
import type { SessionUser } from "@/lib/auth";
import type { UserRole } from "@/types";

const roles: UserRole[] = ["admin", "sales", "viewer"];

export function UserManager({ currentId }: { currentId: number }) {
  const [users, setUsers] = useState<SessionUser[]>([]);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales" as UserRole,
  });
  async function reload() {
    const data = await adminFetch<{ users: SessionUser[] }>("/users");
    setUsers(data.users);
  }

  useEffect(() => {
    reload().catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not load users");
    });
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">Team access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin แก้เนื้อหาและผู้ใช้ได้ Sales ดูแลคำขอใบเสนอราคา Viewer ดูได้อย่างเดียว
        </p>
        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center gap-2 rounded-xl border px-3 py-3">
              <div className="min-w-40 flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <select
                className="h-9 rounded-lg border bg-background px-2 text-sm"
                value={user.role}
                onChange={async (event) => {
                  try {
                    await adminFetch(`/users/${user.id}`, {
                      method: "PATCH",
                      body: JSON.stringify({ role: event.target.value }),
                    });
                    await reload();
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Update failed");
                  }
                }}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {user.id !== currentId ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (!window.confirm(`Remove ${user.email}?`)) return;
                    try {
                      await adminFetch(`/users/${user.id}`, { method: "DELETE" });
                      await reload();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Delete failed");
                    }
                  }}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
        </div>
        <form
          className="mt-5 grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              await adminFetch("/users", { method: "POST", body: JSON.stringify(draft) });
              setDraft({ name: "", email: "", password: "", role: "sales" });
              await reload();
              toast.success("User added");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Could not add the user");
            }
          }}
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <select
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
              value={draft.role}
              onChange={(event) => setDraft({ ...draft, role: event.target.value as UserRole })}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Add user</Button>
        </form>
      </section>

    </div>
  );
}
