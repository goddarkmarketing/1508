import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Globe2,
  Languages,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/page-header";
import { company } from "@/data/company";
import { servicePillars } from "@/data/services";

export const metadata: Metadata = {
  title: "About",
  description: company.description,
};

const valueIcons = [Shield, Users, Globe2] as const;

const credentials = [
  {
    icon: BadgeCheck,
    label: "TAT license",
    value: company.tatLicense,
  },
  {
    icon: Building2,
    label: "Established",
    value: String(company.founded),
  },
  {
    icon: MapPin,
    label: "Operations",
    value: "Bangkok, Thailand",
  },
  {
    icon: Languages,
    label: "Guide languages",
    value: `${company.languages.length}+ languages`,
  },
] as const;

const whyUs = [
  "TAT-licensed DMC with nationwide ground operations from Bangkok",
  "Private, SIC/join, and Muslim-friendly programs ready for agent quotation",
  "Multilingual guides covering ASEAN, European, and Chinese markets",
  "Flexible FIT, incentive, MICE, student, and family group handling",
  "Transparent inclusions with itinerary-led meal and transfer planning",
  "Direct sales contacts for fast response on nett agent rates",
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate min-h-[min(72vh,640px)] overflow-hidden">
        <Image
          src="/brand/expertise-bg.png"
          alt="GGM Thai Travel destination management across Thailand"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-right"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/35" />
        <div className="container-page relative flex min-h-[min(72vh,640px)] flex-col justify-end py-14 text-white sm:py-16">
          <p className="animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/65 duration-700">
            About the company
          </p>
          <h1 className="mt-3 max-w-3xl animate-in fade-in slide-in-from-bottom-3 text-4xl font-semibold tracking-tight duration-700 sm:text-5xl lg:text-6xl">
            <span className="text-brand">GGM</span> Thai Travel
          </h1>
          <p className="mt-2 text-lg text-white/80 sm:text-xl">{company.nameTh}</p>
          <p className="mt-5 max-w-2xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-white/85 duration-700 sm:text-lg">
            {company.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
          <p className="mt-6 text-sm text-white/60">
            TAT License {company.tatLicense} · Founded {company.founded} ·{" "}
            {company.tagline}
          </p>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="container-page grid grid-cols-2 gap-0 lg:grid-cols-4">
          {credentials.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-start gap-2.5 border-b border-border/70 px-1 py-5 sm:gap-3 sm:border-r sm:px-5 sm:py-6 lg:border-b-0 lg:[&:nth-child(4)]:border-r-0"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700 sm:size-10">
                  <Icon className="size-3.5 sm:size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-[0.14em]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy sm:text-base">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              A Bangkok-based DMC built for agent partners
            </h2>
            <div className="mt-6 space-y-4 text-muted-body">
              <p>
                Founded in {company.founded} as a destination management company
                for Asian and long-haul markets into Thailand, GGM Thai Travel
                operates under TAT license {company.tatLicense}.
              </p>
              <p>
                With more than 30 years of executive experience behind the brand,
                we focus on safe programs, quality ground service, and continuous
                product development for travel agents and groups.
              </p>
              <p>
                Our Thailand office handles sales and operations in Bangkok —
                itineraries and reservations are processed locally, then delivered
                nationwide by our own personnel and trusted partners.
              </p>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Private & SIC tour programs",
                "Transfers, guides, and ground arrangements",
                "Muslim-friendly options on selected routes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-navy">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/brand/about-story.png"
              alt="Travel partners meeting in Bangkok with Wat Arun view"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/35 to-transparent p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                Built for travel partners
              </p>
              <p className="mt-1 text-lg font-semibold">
                Bangkok-based · Nationwide delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b">
        <Image
          src="/destinations/bangkok-hero.jpg"
          alt="Bangkok operations base"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/88" />
        <div className="container-page relative section-space text-white">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Expertise
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {company.expertise.title}
            </h2>
            <p className="mt-4 text-white/80">{company.expertise.description}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {company.expertise.stats.map((stat) => (
              <div key={stat.label} className="border-l border-white/20 pl-4">
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 max-w-[12rem] text-sm leading-relaxed text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-[#f7f9fc]">
        <div className="container-page">
          <SectionHeader
            eyebrow="How we work"
            title="Clear values for every booking"
            description="Safety, family-level care, and local expertise guide every itinerary we deliver."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 sm:gap-8">
            {company.values.map((value, index) => {
              const Icon = valueIcons[index] ?? Shield;
              return (
                <div key={value.title} className="border-t border-navy/15 pt-5 sm:pt-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white text-sky-700 shadow-sm sm:size-11">
                    <Icon className="size-4 sm:size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy sm:mt-5 sm:text-lg">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Markets"
              title="Partners across ASEAN, Europe & China"
              description="We support outbound agents sending FIT and groups into Thailand."
              className="mb-6"
            />
            <div className="flex flex-wrap gap-2">
              {company.markets.map((market) => (
                <span
                  key={market}
                  className="border border-border bg-[#f7f9fc] px-3 py-1.5 text-sm font-medium text-navy"
                >
                  {market}
                </span>
              ))}
            </div>

            <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Guide languages
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {company.languages.map((language) => (
                <span
                  key={language}
                  className="inline-flex items-center gap-1.5 border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm text-sky-800"
                >
                  <Languages className="size-3.5" />
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Group specialties"
              title="Programs shaped for your travelers"
              description="From incentive and MICE to family and honeymoon — we tailor ground handling to the group profile."
              className="mb-6"
            />
            <ul className="grid gap-0 sm:grid-cols-2">
              {company.specialties.map((item, index) => (
                <li
                  key={item}
                  className={`flex items-center gap-2.5 border-b border-border/70 px-0 py-3 text-sm text-navy sm:odd:pr-4 sm:even:pl-4 ${
                    index % 2 === 1 ? "" : "sm:border-r"
                  }`}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Services"
            title="What we deliver on the ground"
            description="Core DMC capabilities agents use every day."
            action={
              <Button asChild variant="outline">
                <Link href="/services">View services</Link>
              </Button>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicePillars.map((pillar) => (
              <div key={pillar.title} className="border-l-2 border-sky-600 pl-5">
                <h3 className="text-lg font-semibold text-navy">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-[#f7f9fc]">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow="Why agents choose us"
              title="Reliable Thailand ground handling"
              description="Everything you need to brief clients and confirm operations with confidence."
              className="mb-6"
            />
            <ul className="space-y-3">
              {whyUs.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border/70 lg:min-h-full">
            <Image
              src="/brand/logo-full.png"
              alt={company.name}
              fill
              className="object-contain bg-white p-10"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Sales team"
            title="Talk directly with our operations contacts"
            description="Reach the people who quote and coordinate your Thailand programs."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {company.contacts.map((contact) => (
              <div
                key={contact.name}
                className="border-t border-navy/15 pt-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                  {contact.role}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  {contact.name}
                </h3>
                <div className="mt-5 space-y-3 text-sm">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-navy transition hover:text-sky-700"
                  >
                    <Phone className="size-4 text-sky-600" />
                    {contact.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-navy transition hover:text-sky-700"
                  >
                    <Mail className="size-4 text-sky-600" />
                    {contact.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src="/brand/about-story.png"
          alt="Plan your next Thailand program with GGM"
          fill
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/55 to-navy/35" />
        <div className="container-page relative py-16 text-center text-white sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Partner with GGM
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to build your next Thailand itinerary?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Share travel dates and passenger count — we will return nett options
            for private or join programs.
          </p>
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
              <Link href="/tours">Browse tours</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
