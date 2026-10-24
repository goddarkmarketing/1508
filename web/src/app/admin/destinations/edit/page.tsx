"use client";

import { Suspense } from "react";
import { DestinationEditor } from "@/components/admin/destination-editor";

export default function AdminDestinationEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading destination...</p>}>
      <DestinationEditor />
    </Suspense>
  );
}
