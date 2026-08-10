import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { InquireFormSection } from "@/components/forms/inquire-form-section";

export const metadata: Metadata = {
  title: "Request quote",
  description: "Send a quotation request to GGM Thai Travel.",
};

export default function InquirePage() {
  return (
    <div className="section-space">
      <div className="container-narrow">
        <PageHeader
          title="Request a quote"
          description="Tell us what you need. Sales will follow up with available options and nett rates where applicable."
        />
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">Loading form...</p>
            }
          >
            <InquireFormSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
