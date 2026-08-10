import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { company, navigation } from "@/data/company";

const serviceLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Destinations", href: "/destinations" },
  { label: "Fleet", href: "/fleet" },
  { label: "Services", href: "/services" },
  { label: "Request quote", href: "/inquire" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.1fr]">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src={company.logo}
              alt={company.name}
              width={48}
              height={48}
              className="size-12 rounded-full bg-white object-contain p-0.5"
            />
            <div>
              <p className="font-semibold">
                <span className="text-brand">GGM</span> Thai Travel Co., Ltd.
              </p>
              <p className="text-sm text-white/65">{company.nameTh}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {company.description}
          </p>
          <p className="text-xs text-white/50">TAT License: {company.tatLicense}</p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/55">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/55">
            Services
          </p>
          <ul className="space-y-2 text-sm">
            {serviceLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/55">
            Contact
          </p>
          <ul className="space-y-4 text-sm">
            {company.contacts.map((contact) => (
              <li key={contact.name} className="space-y-1">
                <p className="font-medium">{contact.name}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-white/75 hover:text-white"
                >
                  <Phone className="size-3.5" />
                  {contact.phoneDisplay}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-white/75 hover:text-white"
                >
                  <Mail className="size-3.5" />
                  {contact.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>{company.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
