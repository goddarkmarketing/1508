import { SiteImage as Image } from "@/components/shared/site-image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Plane,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/shared/page-header";
import { DestinationCard } from "@/components/shared/destination-card";
import { TourSlider } from "@/components/shared/tour-slider";
import { QuickQuoteForm } from "@/components/forms/quick-quote-form";
import { company } from "@/data/company";
import { destinations } from "@/data/destinations";
import { homeFaqs } from "@/data/faqs";
import { getFleetByCategory } from "@/data/fleet";
import { getFeaturedTours } from "@/data/tours";
import { servicePillars } from "@/data/services";

export default function HomePage() {
  const featured = getFeaturedTours();
  const featuredDestinations = destinations.slice(0, 6);
  const destinationOptions = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
  }));
  const fleetPreview = getFleetByCategory("van").filter((v) =>
    ["toyota-commuter-9", "toyota-alphard", "toyota-hiace"].includes(v.slug),
  );

  return (
    <>
      <section className="relative isolate w-full overflow-hidden bg-white" data-feedback-id="home-hero" data-feedback-label="Hero banner">
        <Image
          src="/brand/hero-cover.png"
          alt="GGM Thai Travel — Beautiful destinations and professional travel services"
          width={1024}
          height={450}
          priority
          quality={100}
          unoptimized
          className="h-auto w-full"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/70 to-transparent sm:h-32" />
      </section>

      <section id="hero-quote" className="border-b bg-white" data-feedback-id="home-quick-quote" data-feedback-label="Quick quote">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Destination Management · Thailand
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
              <span className="text-brand">GGM</span> Thai Travel
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Flexible private & SIC programs, transfers, and ground services for
              agents across ASEAN, Europe, and China.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="outline">
                <Link href="/tours">
                  Browse tours
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/contact">Contact sales</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              TAT License {company.tatLicense} · Founded {company.founded}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Quick quote
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Request a quotation</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Share destination and passenger count — our team will follow up with options.
              </p>
            </div>
            <QuickQuoteForm destinations={destinationOptions} />
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 pt-8 sm:pt-10" data-feedback-id="home-featured-tours" data-feedback-label="Featured tours">
        <div className="container-page">
          <div className="rounded-t-[2rem] border border-b-0 bg-white px-4 py-6 shadow-sm sm:rounded-t-[2.5rem] sm:px-6 sm:py-8 lg:px-8">
            <TourSlider tours={featured} />
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b" data-feedback-id="home-expertise" data-feedback-label="Expertise">
        <Image
          src="/brand/expertise-bg.png"
          alt="GGM Thai Travel expertise across Thailand"
          fill
          quality={100}
          unoptimized
          className="object-cover object-right"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/20 sm:to-transparent" />
        <div className="container-page relative section-space">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              {company.expertise.title}
            </h2>
            <p className="mt-4 text-muted-body">
              {company.expertise.description}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {company.expertise.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 max-w-[12rem] text-sm leading-relaxed text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-white" data-feedback-id="home-values" data-feedback-label="Value pillars">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Safe programs",
                text: "Experienced specialists delivering ground services nationwide.",
              },
              {
                icon: Users,
                title: company.tagline,
                text: "Attentive care for FIT, groups, incentive, and MICE travelers.",
              },
              {
                icon: Plane,
                title: "Multilingual team",
                text: company.languages.join(" · "),
              },
              {
                icon: BadgeCheck,
                title: "TAT licensed DMC",
                text: `License ${company.tatLicense} — private, SIC, and Muslim-friendly programs for agents.`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border bg-card p-3.5 shadow-sm transition hover:border-primary/30 sm:rounded-2xl sm:p-5"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary sm:size-10">
                  <item.icon className="size-4 sm:size-5" />
                </div>
                <h2 className="mt-3 text-sm font-semibold sm:mt-4 sm:text-base">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space" data-feedback-id="home-destinations" data-feedback-label="Destinations">
        <div className="container-page">
          <SectionHeader
            eyebrow="Destinations"
            title="Explore Thailand with local expertise"
            description="From Bangkok riverside culture to Andaman islands and southern highlands."
            action={
              <Button asChild variant="outline">
                <Link href="/destinations">All destinations</Link>
              </Button>
            }
          />
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-b bg-[#f7f9fc]" data-feedback-id="home-fleet" data-feedback-label="Fleet teaser">
        <div className="container-page">
          <SectionHeader
            eyebrow="Fleet"
            title="Airport transfers & charter vehicles"
            description="VIP vans ready for FIT and groups — clear seat capacity, quoted by route and date."
            action={
              <Button asChild variant="outline">
                <Link href="/fleet">
                  View fleet
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {fleetPreview.map((vehicle) => (
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
                <div className="border-t border-border/60 px-3 py-3 sm:px-4 sm:py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 sm:text-xs">
                    {vehicle.seats}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-navy sm:text-base">
                    {vehicle.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-brand hover:bg-brand/90">
              <Link href="/inquire?type=transfer">
                Request transfer quote
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">See transfer rates</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page">
          <SectionHeader
            eyebrow="Services"
            title="Built for travel partners"
            description="Tour packaging, transfers, Muslim-friendly options, and group operations."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            {servicePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border bg-card p-4 sm:rounded-2xl sm:p-6"
              >
                <div className="mb-2 flex items-center gap-2 text-primary sm:mb-3">
                  <CheckCircle2 className="size-4 sm:size-5" />
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild>
              <Link href="/services">See services & transfer rates</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeader
              className="mb-0"
              eyebrow="FAQ"
              title="Common questions from travel partners"
              description="Quick answers before you send a quotation request."
            />
            <Button asChild variant="outline" className="mt-8">
              <Link href="/inquire">Ask us directly</Link>
            </Button>
          </div>
          <Accordion type="single" collapsible className="rounded-2xl border px-4 md:px-6">
            {homeFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="section-space bg-[#f7f9fc]">
        <div className="container-page">
          <div className="rounded-2xl bg-navy px-6 py-12 text-center text-white shadow-[0_12px_32px_rgba(0,51,102,0.18)] sm:px-12 sm:py-14 lg:px-16">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Ready to plan your next group?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              Send your dates, pax, and preferred destinations — our Bangkok
              operations team will respond with options.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-brand hover:bg-brand/90">
                <Link href="#hero-quote">Request quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Contact sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
