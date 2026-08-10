"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickQuoteForm({
  destinations,
}: {
  destinations: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [destinationSlug, setDestinationSlug] = useState("");
  const [pax, setPax] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    const destinationName =
      destinations.find((d) => d.slug === destinationSlug)?.name ?? "Thailand";
    const paxNumber = pax ? Number(pax) : undefined;

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          inquiryType: "tour",
          destinationSlug: destinationSlug || undefined,
          pax: Number.isFinite(paxNumber) && paxNumber! > 0 ? paxNumber : undefined,
          message: `Quick quote request from homepage for ${destinationName}${
            paxNumber ? ` · ${paxNumber} pax` : ""
          }. Please contact with available package options.`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send request");
      }
      toast.success("Quote request sent");
      router.push("/inquire/success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="qq-name">
          Full name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="qq-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={submitting}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="qq-email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="qq-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@agency.com"
          disabled={submitting}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="qq-destination">Destination</Label>
        <select
          id="qq-destination"
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
          value={destinationSlug}
          onChange={(e) => setDestinationSlug(e.target.value)}
          disabled={submitting}
        >
          <option value="">Select destination</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="qq-pax">Passengers</Label>
        <Input
          id="qq-pax"
          type="number"
          min={1}
          value={pax}
          onChange={(e) => setPax(e.target.value)}
          placeholder="e.g. 12"
          disabled={submitting}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Get a quick quote"
          )}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Need more details? Use the full{" "}
          <a href="/inquire" className="text-primary underline-offset-2 hover:underline">
            inquiry form
          </a>
          .
        </p>
      </div>
    </form>
  );
}
