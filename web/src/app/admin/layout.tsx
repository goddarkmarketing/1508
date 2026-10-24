"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar, adminNavItems } from "@/components/layout/admin-sidebar";
import { AdminSessionProvider } from "@/components/admin/session";
import { adminFetch } from "@/lib/admin-api";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    adminFetch<{ user: SessionUser }>("/auth/me")
      .then((data) => {
        if (!active) return;
        setSession(data.user);
        setReady(true);
      })
      .catch(() => {
        router.replace("/login");
      });
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return (
    <AdminSessionProvider user={session}>
      <div className="flex min-h-svh bg-muted/30">
        <div className="hidden md:block">
          <AdminSidebar userName={session.name} role={session.role} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b bg-card md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-semibold">GGM Admin</p>
              <p className="text-xs text-muted-foreground">{session.name}</p>
            </div>
            <nav className="flex gap-2 overflow-auto px-3 pb-3">
              {adminNavItems.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs",
                      active ? "bg-secondary text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
