"use client";

import dynamic from "next/dynamic";
import { FeedbackProvider } from "@/components/feedback/feedback-context";
import { FeedbackFloatingButton } from "@/components/feedback/feedback-floating-button";
import { FeedbackPreviewBanner } from "@/components/feedback/feedback-preview-banner";

const FeedbackOverlay = dynamic(
  () =>
    import("@/components/feedback/feedback-overlay").then(
      (mod) => mod.FeedbackOverlay,
    ),
  { ssr: false },
);

const FeedbackModal = dynamic(
  () =>
    import("@/components/feedback/feedback-modal").then(
      (mod) => mod.FeedbackModal,
    ),
  { ssr: false },
);

export function FeedbackSystem() {
  return (
    <FeedbackProvider>
      <FeedbackPreviewBanner />
      <FeedbackOverlay />
      <FeedbackModal />
      <FeedbackFloatingButton />
    </FeedbackProvider>
  );
}
