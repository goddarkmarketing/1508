"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DestinationItem = {
  slug: string;
  name: string;
  href: string;
  count: number;
};

type DurationItem = {
  label: string;
  href: string;
  count: number;
};

type Section = "destination" | "duration" | null;

export function ToursNavDropdown({
  destinations,
  durations,
}: {
  destinations: DestinationItem[];
  durations: DurationItem[];
}) {
  const pathname = usePathname();
  const active = pathname.startsWith("/tours");
  const [section, setSection] = useState<Section>(null);

  const toggle = (next: Section) => {
    setSection((current) => (current === next ? null : next));
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) setSection(null);
      }}
    >
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm outline-none transition",
          active
            ? "bg-white/15 text-white"
            : "text-white/75 hover:bg-white/10 hover:text-white",
        )}
      >
        Tours
        <ChevronDown className="size-3.5 opacity-80" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[240px] border-border/80 p-1.5"
      >
        <button
          type="button"
          onClick={() => toggle("destination")}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none transition hover:bg-accent hover:text-accent-foreground",
            section === "destination" && "bg-accent text-accent-foreground",
          )}
        >
          <span>By destination</span>
          <ChevronRight
            className={cn(
              "size-3.5 opacity-60 transition duration-200",
              section === "destination" && "rotate-90",
            )}
          />
        </button>

        {section === "destination" ? (
          <div className="mb-1 ml-2 space-y-0.5 border-l border-border/70 pl-2">
            {destinations.map((item) => (
              <DropdownMenuItem key={item.slug} asChild>
                <Link
                  href={item.href}
                  className="flex cursor-pointer items-center justify-between gap-3"
                >
                  <span className="truncate">{item.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {item.count}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => toggle("duration")}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none transition hover:bg-accent hover:text-accent-foreground",
            section === "duration" && "bg-accent text-accent-foreground",
          )}
        >
          <span>By duration</span>
          <ChevronRight
            className={cn(
              "size-3.5 opacity-60 transition duration-200",
              section === "duration" && "rotate-90",
            )}
          />
        </button>

        {section === "duration" ? (
          <div className="mb-1 ml-2 space-y-0.5 border-l border-border/70 pl-2">
            {durations.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link
                  href={item.href}
                  className="flex cursor-pointer items-center justify-between gap-3"
                >
                  <span>{item.label}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {item.count}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ) : null}

        <DropdownMenuItem asChild>
          <Link href="/tours?muslim=1" className="cursor-pointer">
            Muslim friendly
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/tours" className="cursor-pointer font-medium text-primary">
            View all tours
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
