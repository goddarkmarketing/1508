"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Inbox,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Settings,
} from "lucide-react";
import { clearClientSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearClientSession();
    router.push("/login");
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="border-b px-5 py-5">
        <p className="text-sm font-bold">
          <span className="text-brand">GGM</span> Admin
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{company.shortName}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition",
                active
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs capitalize text-muted-foreground">{role}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full justify-start"
          onClick={logout}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
