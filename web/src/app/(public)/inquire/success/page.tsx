import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InquireSuccessPage() {
  return (
    <div className="section-space">
      <div className="container-narrow text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="size-7" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Inquiry received</h1>
        <p className="mt-3 text-muted-body">
          Thank you. Our team will review your request and contact you shortly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/tours">Browse more tours</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
