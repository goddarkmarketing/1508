import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  Clock3,
  MapPinned,
  MoonStar,
  Ship,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/page-header";
import { company } from "@/data/company";
import { dayTrips, fleet, servicePillars, transferRates } from "@/data/services";
import { getFleetByCategory } from "@/data/fleet";
import { formatCurrencyThb } from "@/lib/format";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Tour operations, transfers by van & coach, and day trips by GGM Thai Travel.",
};

const pillarIcons = [MapPinned, Bus, MoonStar, Users] as const;

const processSteps = [
  {
    step: "01",
    title: "Share requirements",
    text: "Send dates, pax, destination, hotel class, and tour type (private / SIC).",
  },
  {
    step: "02",
    title: "Receive nett options",
    text: "Sales returns package or transfer options with clear inclusions.",
  },
  {
    step: "03",
    title: "Confirm & operate",
    text: "We arrange guides, vehicles, meals, and on-ground coordination.",
  },
] as const;

export default function ServicesPage() {
  const vanShowcase = getFleetByCategory("van").slice(0, 3);

  return (
    <>
      <section className="relative isolate min-h-[min(68vh,600px)] overflow-hidden">
        <Image
          src="/destinations/bangkok-watarun.png"
          alt="GGM Thai Travel ground services across Thailand"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/45" />
        <div className="container-page relative flex min-h-[min(68vh,600px)] flex-col justify-end py-14 text-white sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
            Ground services
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Professional DMC services for travel partners
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Private and SIC packages, van & coach transfers, Muslim-friendly
            programs, and group/MICE handling — operated from Bangkok nationwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
              <Link href="/inquire?type=transfer">
                Request transfer quote
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/tours">Browse tour packages</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">
            TAT License {company.tatLicense} · Reference tariff in THB
          </p>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="What we offer"
            title="Core services for agents and groups"
            description="Everything you need to operate FIT, join tours, and incentive groups in Thailand."
          />
          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
            {servicePillars.map((pillar, index) => {
              const Icon = pillarIcons[index] ?? CheckCircle2;
              return (
                <div key={pillar.title} className="border-t border-navy/15 pt-4 sm:pt-6">
                  <span className="flex size-9 items-center justify-center rounded-full bg-sky-50 text-sky-700 sm:size-11">
                    <Icon className="size-4 sm:size-5" />
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-navy sm:mt-5 sm:text-lg">
                    {pillar.title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-[#f7f9fc]">
        <div className="container-page">
          <SectionHeader
            eyebrow="How it works"
            title="Simple booking flow"
            description="From first inquiry to on-ground delivery."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {processSteps.map((item) => (
              <div key={item.step} className="relative">
                <p className="text-4xl font-bold tracking-tight text-sky-100">
                  {item.step}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Tariff"
            title="Transfer rates (THB)"
            description="Reference rates for airport transfers and full-day charters. Final quotation may vary by date and season."
            action={
              <Button asChild variant="outline">
                <Link href="/inquire?type=transfer">Ask for nett rate</Link>
              </Button>
            }
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {transferRates.map((rate) => (
              <div
                key={rate.vehicle}
                className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_10px_28px_rgba(0,51,102,0.05)]"
              >
                <div className="flex items-center justify-between gap-3 border-b bg-navy px-5 py-4 text-white">
                  <div className="flex items-center gap-2.5">
                    <Bus className="size-4 text-sky-300" />
                    <div>
                      <h3 className="font-semibold">{rate.vehicle}</h3>
                      <p className="text-xs text-white/65">{rate.seats}</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider">
                    THB
                  </span>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-[#f7f9fc] text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      <th className="px-5 py-3 font-semibold">Service</th>
                      <th className="px-5 py-3 text-right font-semibold">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rate.items.map((item, index) => (
                      <tr
                        key={item.description}
                        className={
                          index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                        }
                      >
                        <td className="px-5 py-3.5 text-navy/90">
                          {item.description}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-navy">
                          {formatCurrencyThb(item.rateThb)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {rate.notes?.length ? (
                  <div className="space-y-1.5 border-t bg-[#f7f9fc] px-5 py-4">
                    {rate.notes.map((note) => (
                      <p
                        key={note}
                        className="flex gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
                        {note}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Fleet"
            title="Vehicles ready for FIT and groups"
            description="VIP vans and deluxe/VIP coaches for airport runs, city tours, and long-distance programs."
            action={
              <Button asChild variant="outline">
                <Link href="/fleet">
                  View full fleet
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {vanShowcase.map((vehicle) => (
              <Link
                key={vehicle.slug}
                href="/fleet"
                className="group overflow-hidden rounded-xl border border-border/80 bg-white transition hover:border-sky-200 sm:rounded-2xl"
              >
                <div className="relative aspect-[16/10] bg-white">
                  {vehicle.image ? (
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain p-3 transition duration-500 group-hover:scale-[1.03] sm:p-4"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 sm:text-xs">
                    {vehicle.seats}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-navy">{vehicle.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border/80">
              <div className="flex items-center gap-2 border-b bg-sky-50 px-5 py-3.5">
                <Users className="size-4 text-sky-700" />
                <h3 className="font-semibold text-navy">Vans</h3>
              </div>
              <ul className="divide-y">
                {fleet.vans.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 px-5 py-3 text-sm text-navy"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/80">
              <div className="flex items-center gap-2 border-b bg-sky-50 px-5 py-3.5">
                <Bus className="size-4 text-sky-700" />
                <h3 className="font-semibold text-navy">Coaches</h3>
              </div>
              <ul className="divide-y">
                {fleet.coaches.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 px-5 py-3 text-sm text-navy"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-[#f7f9fc]">
        <div className="container-page">
          <SectionHeader
            eyebrow="Day trips"
            title="Optional add-on experiences"
            description="Ready day programs that can be attached to Pattaya or coastal itineraries."
          />

          {dayTrips.map((trip) => (
            <div
              key={trip.slug}
              className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-[0_10px_28px_rgba(0,51,102,0.05)]"
            >
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[260px]">
                  <Image
                    src="/destinations/pattaya.png"
                    alt={trip.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-5 text-white">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                      <Ship className="size-3.5" />
                      {trip.location}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">{trip.title}</h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {trip.summary}
                  </p>

                  <div className="mt-6">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                      <Clock3 className="size-3.5" />
                      Suggested timing
                    </p>
                    <table className="mt-3 w-full text-sm">
                      <tbody>
                        {trip.timing.map((item, index) => {
                          const [time, ...rest] = item.split(" ");
                          const detail = rest.join(" ");
                          return (
                            <tr
                              key={item}
                              className={
                                index % 2 === 1 ? "bg-[#f7f9fc]" : "bg-white"
                              }
                            >
                              <td className="w-20 px-3 py-2.5 font-semibold tabular-nums text-sky-700">
                                {time}
                              </td>
                              <td className="px-3 py-2.5 text-navy/90">{detail}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                      <UtensilsCrossed className="size-3.5" />
                      Optional activities
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trip.activities.map((activity) => (
                        <span
                          key={activity}
                          className="border border-border bg-[#f7f9fc] px-3 py-1.5 text-xs font-medium text-navy"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">{trip.note}</p>
                  </div>

                  <Button asChild className="mt-6 bg-brand hover:bg-brand/90">
                    <Link href="/inquire?type=custom">
                      Inquire about this day trip
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src="/destinations/phuket-square.png"
          alt="Request a service quotation from GGM Thai Travel"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="container-page relative py-16 text-center text-white sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Need a custom arrangement?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us the dates — we will quote transfers, tours, or full ground handling
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
              <Link href="/inquire">
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
