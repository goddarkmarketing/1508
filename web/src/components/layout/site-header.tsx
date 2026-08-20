"use client";

import { useState } from "react";
import { SiteImage as Image } from "@/components/shared/site-image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaWhatsapp,
} from "react-icons/fa6";
import { company, navigation } from "@/data/company";
import {
  getTourMenuByDestination,
  getTourMenuByDuration,
} from "@/data/tour-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToursNavDropdown } from "@/components/layout/tours-nav-dropdown";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const socialIcons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
  Line: FaLine,
} as const;

const socialHover = {
  Facebook: "hover:bg-[#1877F2] hover:text-white hover:border-transparent",
  Instagram: "hover:bg-[#E4405F] hover:text-white hover:border-transparent",
  WhatsApp: "hover:bg-[#25D366] hover:text-white hover:border-transparent",
  Line: "hover:bg-[#06C755] hover:text-white hover:border-transparent",
} as const;

export function SiteHeader() {
  const pathname = usePathname();
  const primary = company.contacts[0];
  const secondary = company.contacts[1];
  const tourDestinations = getTourMenuByDestination();
  const tourDurations = getTourMenuByDuration();
  const [toursOpen, setToursOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50" data-feedback-id="site-header">
      <div className="border-b border-border/80 bg-white">
        <div className="container-page flex h-10 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-0 text-[11px] tracking-wide text-navy/70 sm:text-xs">
            <a
              href={`tel:${primary.phone}`}
              className="inline-flex items-center gap-2 transition hover:text-primary"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-primary">
                <Phone className="size-3" />
              </span>
              <span className="hidden font-medium text-navy/50 sm:inline">
                {primary.name}
              </span>
              <span className="font-semibold text-navy">{primary.phoneDisplay}</span>
            </a>

            <span className="mx-3 hidden h-3 w-px bg-border md:block" aria-hidden />

            <a
              href={`tel:${secondary.phone}`}
              className="hidden items-center gap-2 transition hover:text-primary md:inline-flex"
            >
              <span className="font-medium text-navy/50">{secondary.name}</span>
              <span className="font-semibold text-navy">{secondary.phoneDisplay}</span>
            </a>

            <span className="mx-3 hidden h-3 w-px bg-border sm:block" aria-hidden />

            <a
              href={`mailto:${company.emails.general}`}
              className="inline-flex min-w-0 items-center gap-2 transition hover:text-primary"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Mail className="size-3" />
              </span>
              <span className="truncate font-medium text-navy">
                {company.emails.general}
              </span>
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher className="hidden sm:block" menuAlign="right" />
            <span className="mr-1 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/40 lg:inline">
              Follow
            </span>
            {company.social.map((item) => {
              const Icon = socialIcons[item.name as keyof typeof socialIcons];
              if (!Icon) return null;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full border border-border/80 bg-white text-navy/65 shadow-[0_1px_2px_rgba(0,51,102,0.05)] transition",
                    socialHover[item.name as keyof typeof socialHover],
                  )}
                >
                  <Icon className="size-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-navy/95 text-navy-foreground backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={company.logo}
              alt={company.name}
              width={44}
              height={44}
              className="size-10 rounded-full bg-white object-contain p-0.5"
              priority
            />
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide text-white">
                <span className="text-brand">GGM</span> Thai Travel
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" data-feedback-id="site-navigation">
            {navigation.map((item) => {
              if (item.href === "/tours") {
                return (
                  <ToursNavDropdown
                    key={item.href}
                    destinations={tourDestinations}
                    durations={tourDurations}
                  />
                );
              }

              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <Link href="/contact">Contact</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="btn-shine hidden bg-brand hover:bg-brand/90 sm:inline-flex"
            >
              <Link href="/inquire">Request quote</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>{company.shortName}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {navigation.map((item) => {
                    if (item.href === "/tours") {
                      return (
                        <div key={item.href} className="rounded-lg">
                          <button
                            type="button"
                            onClick={() => setToursOpen((open) => !open)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                          >
                            Tours
                            <ChevronDown
                              className={cn(
                                "size-4 text-muted-foreground transition",
                                toursOpen && "rotate-180",
                              )}
                            />
                          </button>
                          {toursOpen ? (
                            <div className="mb-2 ml-2 space-y-3 border-l border-border/70 pl-3">
                              <div>
                                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                  By destination
                                </p>
                                {tourDestinations.map((dest) => (
                                  <Link
                                    key={dest.slug}
                                    href={dest.href}
                                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                                  >
                                    <span>{dest.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {dest.count}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                              <div>
                                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                  By duration
                                </p>
                                {tourDurations.map((duration) => (
                                  <Link
                                    key={duration.label}
                                    href={duration.href}
                                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                                  >
                                    <span>{duration.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {duration.count}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                              <Link
                                href="/tours?muslim=1"
                                className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                              >
                                Muslim friendly
                              </Link>
                              <Link
                                href="/tours"
                                className="block rounded-md px-2 py-1.5 text-sm font-medium text-primary hover:bg-muted"
                              >
                                View all tours
                              </Link>
                            </div>
                          ) : null}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  <div className="mt-4 space-y-2 border-t pt-4 text-sm text-muted-foreground">
                    <div className="px-1 pb-2">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Language
                      </p>
                      <LanguageSwitcher menuAlign="left" />
                    </div>
                    <a
                      href={`tel:${primary.phone}`}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Phone className="size-4" />
                      {primary.phoneDisplay}
                    </a>
                    <a
                      href={`mailto:${company.emails.general}`}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <Mail className="size-4" />
                      {company.emails.general}
                    </a>
                  </div>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/contact">Contact</Link>
                  </Button>
                  <Button asChild className="mt-2 bg-brand hover:bg-brand/90">
                    <Link href="/inquire">Request quote</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
