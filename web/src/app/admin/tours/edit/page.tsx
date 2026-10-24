"use client";

import { Suspense } from "react";
import { TourEditor } from "@/components/admin/tour-editor";

export default function AdminTourEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading tour...</p>}>
      <TourEditor />
    </Suspense>
  );
}
