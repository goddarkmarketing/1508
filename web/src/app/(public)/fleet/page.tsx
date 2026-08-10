import type { Metadata } from "next";
import { SiteImage as Image } from "@/components/shared/site-image";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/page-header";
import { company } from "@/data/company";
import { getFleetByCategory } from "@/data/fleet";
import { transferRates } from "@/data/services";
import { formatCurrencyThb } from "@/lib/format";

export const metadata: Metadata = {
  title: "Fleet",
  description:
    "GGM Thai Travel fleet — Toyota Commuter, Alphard, Hiace vans and deluxe/VIP coaches for transfers and group tours.",
};

export default function FleetPage() {
  const vans = getFleetByCategory("van");
  const coaches = getFleetByCategory("coach");

  return (
    <>
      <section className="border-b bg-white">
        <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              Fleet & transfers
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
              Vehicles ready for FIT and groups
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              VIP vans and coaches for airport transfers, private tours, and
              incentive movements — quoted with clear seat capacity and routing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
                <Link href="/inquire?type=transfer">
                  Request transfer quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">View transfer rates</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/70 bg-white">
            <Image
              src="/fleet/commuter-white.webp"
              alt="Toyota Commuter fleet vehicle"
              fill
              priority
              className="object-contain p-4 sm:p-6"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="VIP vans"
            title="Toyota Commuter, Alphard & Hiace"
            description="Vehicle photos from Toyota Motor Thailand product pages for clear model reference."
          />

          <div className="grid gap-8">
            {vans.map((vehicle, index) => (
              <article
                key={vehicle.slug}
                className={`grid overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_10px_28px_rgba(0,51,102,0.05)] lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative min-h-[280px] bg-white sm:min-h-[320px]">
                  {vehicle.image ? (
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain p-6 sm:p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                    <Users className="size-3.5" />
                    {vehicle.seats}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-navy">
                    {vehicle.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Best for: {vehicle.bestFor}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {vehicle.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-navy/90"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {vehicle.gallery?.length ? (
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {vehicle.gallery.map((src) => (
                        <div
                          key={src}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-white"
                        >
                          <Image
                            src={src}
                            alt={`${vehicle.name} gallery`}
                            fill
                            className="object-contain p-2"
                            sizes="120px"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {vehicle.sourceUrl ? (
                    <p className="mt-4 text-[11px] text-muted-foreground">
                      Image reference:{" "}
                      <a
                        href={vehicle.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-sky-700"
                      >
                        toyota.co.th
                      </a>
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-[#f7f9fc]">
        <div className="container-page">
          <SectionHeader
            eyebrow="Coaches"
            title="Deluxe & VIP coaches"
            description="Seat-class options for series groups, incentive, and MICE. Coach photos can be replaced with your own fleet shots when available."
          />

          <div className="overflow-hidden rounded-2xl border border-border/80 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-navy text-left text-white">
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Vehicle
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Seats
                  </th>
                  <th className="hidden px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] md:table-cell">
                    Best for
                  </th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((vehicle, index) => (
                  <tr
                    key={vehicle.slug}
                    className={
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                          <Bus className="size-4" />
                        </span>
                        <span className="font-semibold text-navy">
                          {vehicle.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-sky-700">
                      {vehicle.seats}
                    </td>
                    <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                      {vehicle.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Tariff snapshot"
            title="Reference transfer rates"
            description="Full rate tables and notes are on the Services page."
            action={
              <Button asChild variant="outline">
                <Link href="/services">All transfer rates</Link>
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {transferRates.flatMap((rate) =>
              rate.items.slice(0, 2).map((item) => (
                <div
                  key={`${rate.vehicle}-${item.description}`}
                  className="border-t border-navy/15 pt-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {rate.vehicle} · {rate.seats}
                  </p>
                  <p className="mt-1 text-sm text-navy">{item.description}</p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-navy">
                    {formatCurrencyThb(item.rateThb)}
                  </p>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="border-b bg-navy">
        <div className="container-page py-16 text-center text-white sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Need a vehicle?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us pax, route, and date — we will quote the right vehicle
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            TAT License {company.tatLicense}. Final rates depend on season and
            itinerary.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
              <Link href="/inquire?type=transfer">
                Request quotation
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Contact sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
