import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { company } from "@/data/company";
import { destinations } from "@/data/destinations";
import { getPublishedTours } from "@/data/tours";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact GGM Thai Travel sales and operations team.",
};

export default function ContactPage() {
  const tours = getPublishedTours().map((t) => ({ slug: t.slug, title: t.title }));
  const destinationOptions = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
  }));

  return (
    <div className="section-space">
      <div className="container-page">
        <PageHeader
          title="Contact us"
          description="Please contact us for quotations, group series, transfers, and custom itineraries."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {company.contacts.map((contact) => (
              <div key={contact.name} className="rounded-2xl border bg-card p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {contact.role}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{contact.name}</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-foreground hover:text-primary"
                  >
                    <Phone className="size-4 text-sky-600" />
                    {contact.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 break-all text-foreground hover:text-primary"
                  >
                    <Mail className="size-4 text-sky-600" />
                    {contact.email}
                  </a>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border bg-secondary/50 p-6 sm:col-span-2">
              <h3 className="font-semibold">Emails</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>{company.emails.general}</li>
                <li>{company.emails.manager}</li>
                <li>{company.emails.management}</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                TAT License: {company.tatLicense}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                Send a message
              </p>
              <h2 className="mt-2 text-xl font-semibold text-navy">
                Contact form
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Share your request and our sales team will follow up shortly.
              </p>
            </div>
            <InquiryForm
              tours={tours}
              destinations={destinationOptions}
              defaultType="general"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
