"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { inquirySchema, type InquiryFormValues } from "@/lib/validations";
import { createInquiry } from "@/lib/inquiry-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function InquiryForm({
  tours,
  destinations,
  defaultTour,
  defaultDestination,
  defaultType,
}: {
  tours: { slug: string; title: string }[];
  destinations: { slug: string; name: string }[];
  defaultTour?: string;
  defaultDestination?: string;
  defaultType?: InquiryFormValues["inquiryType"];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const defaults = useMemo<InquiryFormValues>(
    () => ({
      name: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: defaultType ?? (defaultTour ? "tour" : "general"),
      tourSlug: defaultTour ?? "",
      destinationSlug: defaultDestination ?? "",
      travelDate: "",
      pax: undefined,
      message: "",
    }),
    [defaultTour, defaultDestination, defaultType],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: defaults,
  });

  const inquiryType = watch("inquiryType");

  async function onSubmit(values: InquiryFormValues) {
    setSubmitting(true);
    try {
      createInquiry({
        ...values,
        phone: values.phone || undefined,
        company: values.company || undefined,
        tourSlug: values.tourSlug || undefined,
        destinationSlug: values.destinationSlug || undefined,
        travelDate: values.travelDate || undefined,
        pax: values.pax || undefined,
      });
      toast.success("Inquiry sent", {
        description: "Our team will contact you shortly.",
      });
      router.push("/inquire/success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-feedback-id="customer-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name?.message}>
          <Input placeholder="Your name" {...register("name")} disabled={submitting} />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <Input type="email" placeholder="name@company.com" {...register("email")} disabled={submitting} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input placeholder="+66 ..." {...register("phone")} disabled={submitting} />
        </Field>
        <Field label="Company / Agency" error={errors.company?.message}>
          <Input placeholder="Agency name" {...register("company")} disabled={submitting} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Inquiry type" required>
          <select
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
            {...register("inquiryType")}
            disabled={submitting}
          >
            <option value="tour">Tour package</option>
            <option value="transfer">Transfer / charter</option>
            <option value="custom">Custom itinerary</option>
            <option value="general">General</option>
          </select>
        </Field>
        <Field label="Number of passengers" error={errors.pax?.message}>
          <Input
            type="number"
            min={1}
            placeholder="e.g. 12"
            {...register("pax", {
              setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
            })}
            disabled={submitting}
          />
        </Field>
        <Field label="Preferred travel date">
          <Input type="date" {...register("travelDate")} disabled={submitting} />
        </Field>
        <Field label="Destination">
          <select
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
            {...register("destinationSlug")}
            disabled={submitting}
          >
            <option value="">Select destination</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {inquiryType === "tour" ? (
        <Field label="Tour package">
          <select
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
            {...register("tourSlug")}
            disabled={submitting}
          >
            <option value="">Select tour</option>
            {tours.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      <Field label="Message" required error={errors.message?.message}>
        <Textarea
          rows={5}
          placeholder="Share dates, hotel category, special requests, or nett quote needs..."
          {...register("message")}
          disabled={submitting}
        />
      </Field>

      <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send inquiry"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
